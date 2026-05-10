const express = require("express");

module.exports = (db) => {
    const router = express.Router();
router.get("/workers", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.user_id,
        u.fname,
        u.lname,
        u.phone,
        u.government,
        w.city,
        w.job_type,
        w.hourly_rate,
        w.experience_years,
        w.availability_status,
        w.rating
      FROM users u
      JOIN worker w ON u.user_id = w.user_id
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /workers/:job_type
router.get("/workers/:job_type", async (req, res) => {
  try {
    const { job_type } = req.params;

    const result = await db.query(`
      SELECT 
        u.user_id,
        u.fname,
        u.lname,
        u.phone,
        u.government,
        u.city,
        w.job_type,
        w.hourly_rate,
        w.experience_years,
        w.availability_status,
        w.rating
      FROM users u
      JOIN worker w ON u.user_id = w.user_id
      WHERE w.job_type = $1
    `, [job_type]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

return router;
};