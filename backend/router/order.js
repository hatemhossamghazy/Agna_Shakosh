const express = require("express");
const { authenticateToken } = require("../middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
module.exports = (client) => {
    const router = express.Router();
router.get("/addresses", authenticateToken, async (req, res) => {
    try {

        const userId = req.user.id;

        const rentalAddresses = await client.query(`
            SELECT DISTINCT delivery_address
            FROM rental_order
            WHERE customer_id = $1
              AND delivery_address IS NOT NULL
              AND delivery_address != ''
        `, [userId]);

        const saleAddresses = await client.query(`
            SELECT DISTINCT delivery_address
            FROM sale_order
            WHERE customer_id = $1
              AND delivery_address IS NOT NULL
              AND delivery_address != ''
        `, [userId]);

        const allAddresses = [
            ...rentalAddresses.rows,
            ...saleAddresses.rows
        ];

        const uniqueAddresses = Array.from(
            new Set(allAddresses.map(a => a.delivery_address))
        ).map((address, index) => ({
            address_id: index + 1,
            delivery_address: address
        }));

        res.json({
            success: true,
            addresses: uniqueAddresses
        });

    } catch (err) {

        console.error("Get Addresses Error:", err);

        res.status(500).json({
            success: false,
            error: "خطأ في جلب العناوين"
        });

    }
});

router.post(
  "/confirm",
  authenticateToken,
  upload.single("transfer_image"),
  async (req, res) => {

    try {

      const customerId = req.user.id;
      const { address, payment_method, items } = req.body;

      if (!address) {
        return res.status(400).json({ success: false, error: "العنوان مطلوب" });
      }

      if (!payment_method) {
        return res.status(400).json({ success: false, error: "طريقة الدفع مطلوبة" });
      }

      if (!items) {
        return res.status(400).json({ success: false, error: "لا يوجد منتجات" });
      }

      const parsedItems = JSON.parse(items);

      if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
        return res.status(400).json({ success: false, error: "الكارت فارغ" });
      }

      await client.query("BEGIN");

      let totalAmount = 0;
      const insertedOrders = [];

      // التأكد من وجود العميل في جدول customer أولاً
      await client.query(
        `INSERT INTO customer (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
        [customerId]
      );

      // =========================
      // LOOP ITEMS
      // =========================
      for (const item of parsedItems) {

        const equipmentResult = await client.query(
          `SELECT sale_price, price_per_day, type
           FROM equipment
           WHERE equipment_id = $1`,
          [item.equipment_id]
        );

        if (equipmentResult.rows.length === 0) {
          throw new Error("المعدة غير موجودة");
        }

        const equipment = equipmentResult.rows[0];
        // نوع العملية من الجهاز: 'sell' أو 'rent'
        // item.type من الفرونت: 'sale', 'sell', 'rental', 'rent'
        const isSale = item.type === "sale" || item.type === "sell";
        const isRental = item.type === "rental" || item.type === "rent";

        // =========================
        // SALE ORDER
        // =========================
        if (isSale) {

          const price = equipment.sale_price;
          const itemTotal = price * item.quantity;

          totalAmount += itemTotal;

          const orderResult = await client.query(
            `INSERT INTO sale_order
             (price, status, equipment_id, payment_id, customer_id, quantity, delivery_address)
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             RETURNING *`,
            [
              itemTotal,
              "pending",
              item.equipment_id,
              null,
              customerId,
              item.quantity,
              address
            ]
          );

          insertedOrders.push({
            ...orderResult.rows[0],
            type: "sale"
          });
        }

        // =========================
        // RENTAL ORDER
        // =========================
        else if (isRental) {

          // CHECK التعارض في التواريخ
          const conflict = await client.query(
            `SELECT rental_id FROM rental_order
             WHERE equipment_id = $1
               AND status NOT IN ('cancelled', 'returned')
               AND start_date < $3
               AND end_date > $2`,
            [item.equipment_id, item.start_date, item.end_date]
          );

          if (conflict.rows.length > 0) {
            const nextAvail = await client.query(
              `SELECT MAX(end_date) AS next_available
               FROM rental_order
               WHERE equipment_id = $1
                 AND status NOT IN ('cancelled', 'returned')`,
              [item.equipment_id]
            );
            const nextDate = nextAvail.rows[0].next_available
              ? new Date(nextAvail.rows[0].next_available).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
              : null;

            throw new Error(
              nextDate
                ? `المعدة محجوزة حتى ${nextDate} — اختار تاريخ بعده`
                : `المعدة غير متاحة في هذه الفترة`
            );
          }

          const price = equipment.price_per_day;
          const days =
            item.start_date && item.end_date
              ? Math.ceil(
                  (new Date(item.end_date) - new Date(item.start_date)) /
                  (1000 * 60 * 60 * 24)
                ) || 1
              : 1;

          const itemTotal = price * days * item.quantity;

          totalAmount += itemTotal;

          const orderResult = await client.query(
            `INSERT INTO rental_order
             (start_date, end_date, total_price, status, equipment_id, payment_id, customer_id, quantity, delivery_address)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
             RETURNING *`,
            [
              item.start_date,
              item.end_date,
              itemTotal,
              "pending",
              item.equipment_id,
              null,
              customerId,
              item.quantity,
              address
            ]
          );

          insertedOrders.push({
            ...orderResult.rows[0],
            type: "rental"
          });
        }
      }

      // =========================
      // PAYMENT
      // =========================
      const paymentResult = await client.query(
        `INSERT INTO payment (amount, type, status, customer_id)
         VALUES ($1,$2,$3,$4)
         RETURNING payment_id`,
        [
          totalAmount,
          payment_method,
          payment_method === "cash_on_delivery"
            ? "pending"
            : "waiting_review",
          customerId
        ]
      );

      const paymentId = paymentResult.rows[0].payment_id;

      // =========================
      // LINK ORDERS WITH PAYMENT
      // =========================
      for (const order of insertedOrders) {
        if (order.type === "sale") {
          await client.query(
            `UPDATE sale_order SET payment_id = $1 WHERE sale_id = $2`,
            [paymentId, order.sale_id]
          );
        }

        if (order.type === "rental") {
          await client.query(
            `UPDATE rental_order SET payment_id = $1 WHERE rental_id = $2`,
            [paymentId, order.rental_id]
          );
        }
      }

      await client.query("COMMIT");

      return res.status(201).json({
        success: true,
        message: "تم إنشاء الطلب بنجاح",
        payment_id: paymentId,
        orders: insertedOrders
      });

    } catch (err) {

      await client.query("ROLLBACK");

      console.error(err);

      return res.status(500).json({
        success: false,
        error: err.message || "حدث خطأ أثناء إنشاء الطلب"
      });

    }
  }
);
    return router;
};