// routes/profile.js

const express = require("express");
const { authenticateToken } = require("../middleware");

module.exports = (db) => {
  const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
  `
  SELECT 
    u.user_id,
    u.fname,
    u.lname,
    u.email,
    u.phone,
    u.date_of_birth,
    u.government,
    u.city,
    u.street,
    u.role,

    w.job_type,
    w.hourly_rate,
    w.experience_years,
    w.bio,
    w.profile_picture

  FROM users u
  LEFT JOIN worker w ON u.user_id = w.user_id
  WHERE u.user_id = $1
  `,
  [userId]
);
console.log("USER ID:", userId);
console.log("RESULT:", result.rows);
    return res.json({
      success: true,
      user: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});
  
  return router;
};
