const express = require("express");

module.exports = (client) => {
    const router = express.Router();
router.get("/workers", async (req, res) => {
  try {
    const result = await client.query(`
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
      where w.subscription = true
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

    const result = await client.query(`
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
      WHERE w.job_type = $1 AND w.subscription = true
    `, [job_type]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /worker/pending/subscriptions - العمال اللي subscription = false
router.get("/pending/subscriptions", async (req, res) => {
  try {
    const result = await client.query(`
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
        w.bio,
        w.profile_picture
      FROM users u
      JOIN worker w ON u.user_id = w.user_id
      WHERE w.subscription = false OR w.subscription IS NULL
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /worker/approve/:id - تفعيل الاشتراك
router.post("/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await client.query(
      `UPDATE worker SET subscription = true WHERE user_id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "العامل غير موجود" });
    }

    res.json({
      success: true,
      message: "تم تفعيل اشتراك العامل بنجاح",
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /worker/reject/:id - رفض وحذف العامل
router.post("/reject/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await client.query(
      `DELETE FROM worker WHERE user_id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "العامل غير موجود" });
    }

    res.json({
      success: true,
      message: "تم رفض العامل وحذفه من قائمة الانتظار",
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await client.query(`
     SELECT 
  u.user_id,
  u.fname,
  u.lname,
  u.phone,
  u.city AS location,
  u.government,
  w.job_type,
  w.rating,
  w.experience_years,
  w.availability_status
FROM users u
JOIN worker w ON u.user_id = w.user_id
WHERE u.user_id = $1
    `, [id]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
return router;
};