const express = require("express");
const multer = require("multer");
const path = require("path");

// إعداد multer لرفع الصور
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (isValid) cb(null, true);
        else cb(new Error("الصورة لازم تكون jpeg أو jpg أو png"));
    },
});

module.exports = (client) => {
    const router = express.Router();

    // GET /order/addresses/:customer_id - جيب العناوين القديمة
    router.get("/order/addresses/:customer_id", async (req, res) => {
        try {
            const { customer_id } = req.params;

            const rentalAddresses = await client.query(
                `
      SELECT DISTINCT delivery_address FROM rental_order
      WHERE customer_id = $1 AND delivery_address IS NOT NULL
    `,
                [customer_id]
            );

            const saleAddresses = await client.query(
                `
      SELECT DISTINCT delivery_address FROM sale_order
      WHERE customer_id = $1 AND delivery_address IS NOT NULL
    `,
                [customer_id]
            );

            const allAddresses = [...rentalAddresses.rows, ...saleAddresses.rows].filter(
                (v, i, a) => a.findIndex((t) => t.delivery_address === v.delivery_address) === i
            );

            if (allAddresses.length === 0) {
                return res.json({ message: "مفيش عناوين قديمة", addresses: [] });
            }

            res.json({ addresses: allAddresses });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // POST /order/confirm - تأكيد الطلب
    router.post("/order/confirm", upload.single("transfer_image"), async (req, res) => {
        try {
            const { customer_id, address, address_type, payment_method, items } = req.body;
            const parsedItems = JSON.parse(items);

            // لو مش دفع عند الاستلام لازم يكون فيه صورة
            if (payment_method !== "cash_on_delivery" && !req.file) {
                return res.status(400).json({ error: "لازم ترفع صورة التحويل" });
            }

            const transfer_image = req.file ? req.file.filename : null;

            await client.query("BEGIN");

            const orders = [];

            for (const item of parsedItems) {
                const equipment = await client.query(
                    `SELECT price_per_day, sale_price FROM equipment WHERE equipment_id = $1`,
                    [item.equipment_id]
                );

                const eq = equipment.rows[0];
                let itemPrice = 0;

                const payment = await client.query(
                    `INSERT INTO payment (amount, type, status, customer_id) 
         VALUES ($1, $2, 'pending', $3) RETURNING payment_id`,
                    [0, payment_method, customer_id]
                );

                const payment_id = payment.rows[0].payment_id;

                if (item.type === "rent") {
                    const days = Math.ceil(
                        (new Date(item.end_date) - new Date(item.start_date)) / (1000 * 60 * 60 * 24)
                    );
                    itemPrice = eq.price_per_day * item.quantity * days;

                    await client.query(`UPDATE payment SET amount = $1 WHERE payment_id = $2`, [
                        itemPrice,
                        payment_id,
                    ]);

                    const order = await client.query(
                        `INSERT INTO rental_order (start_date, end_date, total_price, status, equipment_id, payment_id, customer_id, quantity, delivery_address)
           VALUES ($1, $2, $3, 'pending', $4, $5, $6, $7, $8) RETURNING rental_id`,
                        [
                            item.start_date,
                            item.end_date,
                            itemPrice,
                            item.equipment_id,
                            payment_id,
                            customer_id,
                            item.quantity,
                            address,
                        ]
                    );

                    orders.push({ type: "rent", order_id: order.rows[0].rental_id });
                } else if (item.type === "sale") {
                    itemPrice = eq.sale_price * item.quantity;

                    await client.query(`UPDATE payment SET amount = $1 WHERE payment_id = $2`, [
                        itemPrice,
                        payment_id,
                    ]);

                    const order = await client.query(
                        `INSERT INTO sale_order (price, status, equipment_id, payment_id, customer_id, quantity, delivery_address)
           VALUES ($1, 'pending', $2, $3, $4, $5, $6) RETURNING sale_id`,
                        [itemPrice, item.equipment_id, payment_id, customer_id, item.quantity, address]
                    );

                    orders.push({ type: "sale", order_id: order.rows[0].sale_id });
                }
            }

            await client.query("COMMIT");

            res.json({
                message: "تم تأكيد الطلب بنجاح",
                address_type,
                payment_method,
                transfer_image,
                orders,
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

    return router;
};
