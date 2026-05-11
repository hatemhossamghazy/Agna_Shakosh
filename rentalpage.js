const express = require("express");

module.exports = (client) => {
    const router = express.Router();

    router.get("/equipment/search", async (req, res) => {
        try {
            const { q } = req.query;

            const result = await client.query(
                `SELECT * FROM equipment WHERE LOWER(name) LIKE LOWER($1)`,
                [`%${q}%`]
            );

            res.json(result.rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    router.get("/equipment", async (req, res) => {
        try {
            const result = await client.query(
                `SELECT * FROM equipment WHERE type IN ('rent', 'both')`
            );
            res.json(result.rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    router.get("/equipment/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const result = await client.query(
                `SELECT e.*, 
                        r.end_date AS next_available_date
                 FROM equipment e
                 LEFT JOIN rental_order r ON r.equipment_id = e.equipment_id 
                     AND r.status = 'pending'
                 WHERE e.equipment_id = $1
                 ORDER BY r.end_date DESC
                 LIMIT 1`,
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "المعدة غير موجودة" });
            }

            res.json(result.rows[0]);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    router.get("/equipment/rental/:type", async (req, res) => {
        try {
            const { type } = req.params;

            const result = await client.query(
                `SELECT * FROM equipment
                 WHERE type IN ('rent', 'both')
                 AND rental_type = $1`,
                [type]
            );

            res.json(result.rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};