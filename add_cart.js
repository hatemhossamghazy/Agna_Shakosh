const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware");
const { authorizeRoles } = require("../middleware");
//  authorizeRoles("client"),authenticateToken,
module.exports = (client) => {

  router.post("/add", authenticateToken,async (req, res) => {
      console.log("USER:", req.user);      // 👈 هنا
  console.log("BODY:", req.body);  
  console.log("ROLE:", req.user.role);

    const user_id = req.user.id;
const { equipment_id, quantity = 1 } = req.body;

    if (!user_id || !equipment_id) {
      return res.status(400).json({
        success: false,
        message: "user_id and equipment_id are required"
      });
    }

    try {
      // 1. check if item already exists
      const checkQuery = `
        SELECT * FROM cart
        WHERE user_id = $1 AND equipment_id = $2
      `;

      const checkResult = await client.query(checkQuery, [user_id, equipment_id]);

      if (checkResult.rows.length > 0) {
        // 2. update quantity
        const updateQuery = `
          UPDATE cart
          SET quantity = quantity + $1
          WHERE user_id = $2 AND equipment_id = $3
          RETURNING *
        `;

        const updated = await client.query(updateQuery, [
          quantity,
          user_id,
          equipment_id
        ]);

        return res.json({
          success: true,
          message: "Cart updated",
          cart: updated.rows[0]
        });
      }

      // 3. insert new item
      const insertQuery = `
        INSERT INTO cart (user_id, equipment_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      const inserted = await client.query(insertQuery, [
        user_id,
        equipment_id,
        quantity
      ]);

      return res.json({
        success: true,
        message: "Added to cart",
        cart: inserted.rows[0]
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  });

  router.post("/addR", authenticateToken, async (req, res) => {
  try {
    const {
      equipment_id,
      quantity = 1,
      start_date,
      end_date,
      total,
      insurance_amount
    } = req.body;

    const user_id = req.user.id;

    const query = `
      INSERT INTO cart (
        user_id,
        equipment_id,
        quantity,
        start_date,
        end_date,
        total,
        insurance_amount
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (user_id, equipment_id)
      DO UPDATE SET
        quantity = cart.quantity + EXCLUDED.quantity,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        total = EXCLUDED.total,
        insurance_amount = EXCLUDED.insurance_amount
      RETURNING *;
    `;

    const result = await client.query(query, [
      user_id,
      equipment_id,
      quantity,
      start_date,
      end_date,
      total,
      insurance_amount
    ]);

    return res.status(201).json({
      success: true,
      cart: result.rows[0]
    });

  } catch (err) {
    console.error("ADD CART ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
  return router;
};