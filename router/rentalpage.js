const express = require("express");

module.exports = (db) => {
    const router = express.Router();

router.get("/equipment/search", async (req, res) => {
  try {
    const { q } = req.query;

    const result = await db.query(
      `
      SELECT *
      FROM equipment
      WHERE LOWER(name) LIKE LOWER($1)
      `,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/equipment", async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT *
      FROM equipment
      WHERE type IN ('rent', 'both')
      `
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/equipment/rental/:type", async (req, res) => {
  try {
    const { type } = req.params;

    const result = await db.query(
      `
      SELECT *
      FROM equipment
      WHERE type IN ('rent', 'both')
      AND rental_type = $1
      `,
      [type]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

    return router;
};