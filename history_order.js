const express = require("express");

module.exports = (client) => {
    const router = express.Router();

    // GET /orders - كل الأوردرات (إيجار + بيع)
    router.get("/orders", async (req, res) => {
        try {
            const rentalOrders = await client.query(`
        SELECT 
          r.rental_id AS order_id,
          'rent' AS order_type,
          r.start_date AS date,
          r.quantity,
          r.delivery_address,
          r.total_price,
          r.status,
          e.name AS equipment_name,
          r.customer_id
        FROM rental_order r
        JOIN equipment e ON r.equipment_id = e.equipment_id
      `);
const saleOrders = await client.query(`
SELECT 
  s.sale_id AS order_id,
  'sale' AS order_type,
  s.quantity,
  s.delivery_address,
  s.price AS total_price,
  s.status,
  e.name AS equipment_name,
  s.customer_id,
  p.amount AS payment_amount,
  p.type AS payment_type,
  p.status AS payment_status,
  p.date AS date
FROM sale_order s
JOIN equipment e ON s.equipment_id = e.equipment_id
LEFT JOIN payment p ON s.payment_id = p.payment_id
ORDER BY s.sale_id DESC
`);
            const allOrders = [...rentalOrders.rows, ...saleOrders.rows];
            res.json(allOrders);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // GET /orders/rental/:id - تفاصيل أوردر الإيجار
    // router.get("/orders/rental/:id", async (req, res) => {
    //     try {
    //         const { id } = req.params;

    //         const result = await client.query(
    //             `
    //     SELECT 
    //       r.rental_id,
    //       r.start_date,
    //       r.end_date,
    //       r.quantity,
    //       r.delivery_address,
    //       r.total_price,
    //       r.status,
    //       e.name AS equipment_name,
    //       e.description,
    //       e.price_per_day,
    //       u.fname,
    //       u.lname,
    //       u.phone,
    //       u.government,
    //       u.city
    //     FROM rental_order r
    //     JOIN equipment e ON r.equipment_id = e.equipment_id
    //     JOIN users u ON r.customer_id = u.user_id
    //     WHERE r.rental_id = $1
    //   `,
    //             [id]
    //         );

    //         if (result.rows.length === 0) {
    //             return res.status(404).json({ error: "الأوردر مش موجود" });
    //         }

    //         res.json(result.rows[0]);
    //     } catch (err) {
    //         res.status(500).json({ error: err.message });
    //     }
    // });

    // // GET /orders/sale/:id - تفاصيل أوردر البيع
    // router.get("/orders/sale/:id", async (req, res) => {
    //     try {
    //         const { id } = req.params;

    //         const result = await client.query(
    //             `
    //     SELECT 
    //       s.sale_id,
    //       s.quantity,
    //       s.delivery_address,
    //       s.price AS total_price,
    //       s.status,
    //       e.name AS equipment_name,
    //       e.description,
    //       e.sale_price,
    //       u.fname,
    //       u.lname,
    //       u.phone,
    //       u.government,
    //       u.city
    //     FROM sale_order s
    //     JOIN equipment e ON s.equipment_id = e.equipment_id
    //     JOIN users u ON s.customer_id = u.user_id
    //     WHERE s.sale_id = $1
    //   `,
    //             [id]
    //         );

    //         if (result.rows.length === 0) {
    //             return res.status(404).json({ error: "الأوردر مش موجود" });
    //         }

    //         res.json(result.rows[0]);
    //     } catch (err) {
    //         res.status(500).json({ error: err.message });
    //     }
    // });

    return router;
};
