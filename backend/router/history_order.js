const express = require("express");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware");
const { authorizeRoles } = require("../middleware");
module.exports = (client) => {
    const router = express.Router();

    // GET /orders - كل الأوردرات (إيجار + بيع)
   router.get("/orders", authenticateToken, async (req, res) => {
  try {

    const customerId = req.user.id;

    const rentalOrders = await client.query(`
      SELECT 
        r.rental_id AS order_id,
        'rental' AS order_type,
        r.start_date,
        r.end_date,
        r.start_date AS date,
        r.quantity,
        r.delivery_address,
        r.total_price,
        r.status,

        e.name AS equipment_name,
        e.image_url,

        r.customer_id,

        p.amount AS payment_amount,
        p.type AS payment_type,
        p.status AS payment_status,
        p.date AS payment_date

      FROM rental_order r

      JOIN equipment e 
      ON r.equipment_id = e.equipment_id

      LEFT JOIN payment p 
      ON r.payment_id = p.payment_id

      WHERE r.customer_id = $1

      ORDER BY r.rental_id DESC
    `, [customerId]);

    const saleOrders = await client.query(`
      SELECT 
        s.sale_id AS order_id,
        'sale' AS order_type,

        NULL AS start_date,
        NULL AS end_date,

        p.date AS date,

        s.quantity,
        s.delivery_address,
        s.price AS total_price,
        s.status,

        e.name AS equipment_name,
        e.image_url,

        s.customer_id,

        p.amount AS payment_amount,
        p.type AS payment_type,
        p.status AS payment_status,
        p.date AS payment_date

      FROM sale_order s

      JOIN equipment e 
      ON s.equipment_id = e.equipment_id

      LEFT JOIN payment p 
      ON s.payment_id = p.payment_id

      WHERE s.customer_id = $1

      ORDER BY s.sale_id DESC
    `, [customerId]);

    const allOrders = [
      ...rentalOrders.rows,
      ...saleOrders.rows
    ];

    allOrders.sort((a, b) => {
      return new Date(b.date || b.payment_date) - new Date(a.date || a.payment_date);
    });

    res.json({
      success: true,
      orders: allOrders
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
});


router.get("/orders/:id", authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.id;
    const { id } = req.params;

    const rental = await client.query(`
      SELECT 
        r.rental_id AS order_id,
        'rental' AS order_type,
        r.start_date,
        r.end_date,
        r.quantity,
        r.delivery_address,
        r.total_price,
        r.status,
        e.name AS equipment_name,
        p.type AS payment_type,
        p.amount AS payment_amount
      FROM rental_order r
      JOIN equipment e ON r.equipment_id = e.equipment_id
      LEFT JOIN payment p ON r.payment_id = p.payment_id
      WHERE r.rental_id = $1 AND r.customer_id = $2
    `, [id, customerId]);

    if (rental.rows.length > 0) {
      return res.json({ success: true, order: rental.rows[0] });
    }

    const sale = await client.query(`
      SELECT 
        s.sale_id AS order_id,
        'sale' AS order_type,
        s.quantity,
        s.delivery_address,
        s.price AS total_price,
        s.status,
        e.name AS equipment_name,
        p.type AS payment_type,
        p.amount AS payment_amount
      FROM sale_order s
      JOIN equipment e ON s.equipment_id = e.equipment_id
      LEFT JOIN payment p ON s.payment_id = p.payment_id
      WHERE s.sale_id = $1 AND s.customer_id = $2
    `, [id, customerId]);

    if (sale.rows.length > 0) {
      return res.json({ success: true, order: sale.rows[0] });
    }

    res.status(404).json({ success: false, message: "Order not found" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

    return router;
};