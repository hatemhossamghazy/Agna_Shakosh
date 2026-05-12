const express = require("express");

/** Delivery fee placeholder — adjust rates to match your business rules */
function calculateDelivery(government, quantity) {
    const q = Math.max(0, Number(quantity) || 0);
    if (q < 1) return 0;
    const gov = government != null ? String(government).trim() : "";
    const base = gov ? 75 : 100;
    return base + q * 15;
}

module.exports = (client) => {
    const router = express.Router();

    // POST /confirm — mounted at /cart → POST /cart/confirm
    router.post("/confirm", async (req, res) => {
        try {
            const { customer_id, government, items } = req.body;

            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ error: "items مطلوبة وغير فاضية" });
            }

            await client.query("BEGIN");

            const orders = [];
            let totalPrice = 0;
            let totalDelivery = 0;

            for (const item of items) {
                const equipment = await client.query(
                    `SELECT price_per_day, sale_price FROM equipment WHERE equipment_id = $1`,
                    [item.equipment_id]
                );
                if (!equipment.rows[0]) throw new Error("Equipment not found");
                const eq = equipment.rows[0];
                let itemPrice = 0;

                if (item.type === "rent") {
                    const days = Math.ceil(
                        (new Date(item.end_date) - new Date(item.start_date)) / (1000 * 60 * 60 * 24)
                    );
                    itemPrice = eq.price_per_day * item.quantity * days;

                    const delivery = calculateDelivery(government, item.quantity);
                    totalDelivery += delivery;
                    const payment = await client.query(
                        `INSERT INTO payment (amount, type, status, customer_id) VALUES ($1, 'cash', 'pending', $2) RETURNING payment_id`,
                        [itemPrice + delivery, customer_id]
                    );

                    const order = await client.query(
                        `INSERT INTO rental_order (start_date, end_date, total_price, status, equipment_id, payment_id, customer_id, quantity, delivery_address)
             VALUES ($1, $2, $3, 'pending', $4, $5, $6, $7, $8) RETURNING rental_id`,
                        [
                            item.start_date,
                            item.end_date,
                            itemPrice + delivery,
                            item.equipment_id,
                            payment.rows[0].payment_id,
                            customer_id,
                            item.quantity,
                            government,
                        ]
                    );

                    orders.push({ type: "rent", order_id: order.rows[0].rental_id });
                    totalPrice += itemPrice + delivery;
                } else if (item.type === "sale") {
                    itemPrice = eq.sale_price * item.quantity;

                    const delivery = calculateDelivery(government, item.quantity);
                    totalDelivery += delivery;
                    const payment = await client.query(
                        `INSERT INTO payment (amount, type, status, customer_id) VALUES ($1, 'cash', 'pending', $2) RETURNING payment_id`,
                        [itemPrice + delivery, customer_id]
                    );

                    const order = await client.query(
                        `INSERT INTO sale_order (price, status, equipment_id, payment_id, customer_id, quantity, delivery_address)
             VALUES ($1, 'pending', $2, $3, $4, $5, $6) RETURNING sale_id`,
                        [itemPrice + delivery, item.equipment_id, payment.rows[0].payment_id, customer_id, item.quantity, government]
                    );

                    orders.push({ type: "sale", order_id: order.rows[0].sale_id });
                    totalPrice += itemPrice + delivery;
                }
            }

            await client.query("COMMIT");

            res.json({
                message: "تم تأكيد الأوردر بنجاح",
                orders,
                total_price: totalPrice,
                delivery_cost: totalDelivery,
            });
        } catch (err) {
            try {
                await client.query("ROLLBACK");
            } catch (_) {
                /* no active transaction */
            }
            res.status(500).json({ error: err.message });
        }
    });


    // GET /rental/check-availability/:id
router.get("/check-availability/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ 
        success: false, 
        error: "التواريخ مطلوبة" 
      });
    }

    const conflict = await client.query(
      `SELECT rental_id, start_date, end_date 
       FROM rental_order
       WHERE equipment_id = $1
         AND status NOT IN ('cancelled', 'returned')
         AND start_date < $3
         AND end_date > $2`,
      [id, start_date, end_date]
    );

    const isAvailable = conflict.rows.length === 0;

    // جيب أقرب تاريخ متاح لو محجوزة
    const nextAvailable = await client.query(
      `SELECT MAX(end_date) AS next_available
       FROM rental_order
       WHERE equipment_id = $1
         AND status NOT IN ('cancelled', 'returned')`,
      [id]
    );

    return res.json({
      success: true,
      available: isAvailable,
      next_available_date: nextAvailable.rows[0].next_available || null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});
    return router;
};
