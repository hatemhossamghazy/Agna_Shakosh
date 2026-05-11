const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware");
const { authorizeRoles } = require("../middleware");
//  authorizeRoles("client"),authenticateToken,
module.exports = (client) => {
         router.get("/", authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await client.query(
  `
  SELECT 
    c.cart_id,
    c.quantity,
    c.start_date,
    c.end_date,
    c.total,
    c.insurance_amount,

    e.equipment_id,
    e.name,
    e.sale_price,
    e.price_per_day,
    e.image_url,
    e.type

  FROM cart c
  JOIN equipment e 
  ON c.equipment_id = e.equipment_id

  WHERE c.user_id = $1
  `,
  [user_id]
);

    return res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

router.get("/eq/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query(
      `SELECT * FROM equipment WHERE equipment_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found"
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
router.delete("/:id", authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;

  try {
    await client.query(
      `DELETE FROM cart WHERE cart_id = $1 AND user_id = $2`,
      [id, user_id]
    );

    res.json({
      success: true,
      message: "Item removed"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
//////////////
//=================
//============
router.delete("/cart/clear", authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    await client.query(
      `DELETE FROM cart WHERE user_id = $1`,
      [user_id]
    );

    res.json({
      success: true,
      message: "Cart cleared"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

     return router;
};