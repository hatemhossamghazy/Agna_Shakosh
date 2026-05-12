const express = require("express");
const router = express.Router();
const uploadLocal = require("../middleware/uploadLocal");
const { authenticateToken } = require("../middleware");

module.exports = (client) => {
    // POST /review/add
router.post("/add", authenticateToken, uploadLocal.single("image"), async (req, res) => {
    try {
        const { name, price, type, condition, description, category } = req.body;
        const seller_id = req.user.id;
        const image_url = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;

        const query = `
            INSERT INTO equipment_review 
            (name, sale_price, type, condition, description, category, image_url, seller_id, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
            RETURNING *
        `;

        const result = await client.query(query, [
            name, price, type, condition, description, category, image_url, seller_id
        ]);

        res.status(201).json({
            success: true,
            message: "تم إرسال طلبك للأدمن.. طلبك هيتراجع وهيصلك إشعار أول ما يتوافق عليه.",
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "حدث خطأ أثناء الرفع" });
    }
});

    // GET /review/pending
router.get("/pending", async (req, res) => {
    try {
        const result = await client.query(
            `SELECT er.*, u.fname || ' ' || u.lname AS seller_name, u.phone AS seller_phone
             FROM equipment_review er
             JOIN users u ON u.user_id = er.seller_id
             WHERE er.status = 'pending'
             ORDER BY er.review_id DESC`
        );

        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error("Fetch pending reviews error:", err);
        res.status(500).json({ success: false, error: "حدث خطأ أثناء جلب الطلبات" });
    }
});

    // POST /review/approve/:id
router.post("/approve/:id", async (req, res) => {
    try {
        const reviewId = req.params.id;

        await client.query("BEGIN");

        const reviewResult = await client.query(
            `SELECT * FROM equipment_review WHERE review_id = $1`,
            [reviewId]
        );

        if (reviewResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ success: false, error: "المراجعة غير موجودة" });
        }

        const review = reviewResult.rows[0];

        if (review.status !== 'pending') {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                error: review.status === 'approved'
                    ? "تمت الموافقة على هذا العرض مسبقاً"
                    : "لا يمكن الموافقة على هذا العرض"
            });
        }

        await client.query(
            `UPDATE equipment_review SET status = 'approved' WHERE review_id = $1`,
            [reviewId]
        );

        // التأكد من وجود البائع في جدول seller (لأن equipment.seller_id → seller.user_id)
        await client.query(
            `INSERT INTO seller (user_id)
             VALUES ($1)
             ON CONFLICT (user_id) DO NOTHING`,
            [review.seller_id]
        );

        // Insert into equipment with all required fields
        const insertResult = await client.query(
            `INSERT INTO equipment 
             (name, description, image_url, category, sale_price, type, status, seller_id, rental_type, price_per_day)
             VALUES ($1, $2, $3, $4, ROUND($5)::integer, $6, 'available', $7, $8, $9)
             RETURNING *`,
            [
                review.name, review.description, review.image_url,
                review.category, review.sale_price,
                review.type === 'sale' ? 'sell' : review.type, // تحويل sale → sell
                review.seller_id,
                review.type === 'rent' ? 'daily' : null,
                0
            ]
        );

        await client.query(
            `DELETE FROM equipment_review WHERE review_id = $1`,
            [reviewId]
        );

        await client.query("COMMIT");

        res.status(200).json({
            success: true,
            message: "تم الموافقة على العرض ونقله إلى المعدات المتاحة",
            data: insertResult.rows[0]
        });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Approve Error:", err);
        res.status(500).json({ success: false, error: "حدث خطأ أثناء الموافقة: " + err.message });
    }
});

    // POST /review/reject/:id
router.post("/reject/:id", async (req, res) => {
    try {
        const reviewId = req.params.id;

        const reviewResult = await client.query(
            `SELECT status FROM equipment_review WHERE review_id = $1`,
            [reviewId]
        );

        if (reviewResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: "المراجعة غير موجودة" });
        }

        if (reviewResult.rows[0].status !== 'pending') {
            return res.status(400).json({ success: false, error: "لا يمكن رفض هذا العرض لأنه تمت معالجته مسبقاً" });
        }

        await client.query(
            `UPDATE equipment_review SET status = 'rejected' WHERE review_id = $1`,
            [reviewId]
        );

        res.status(200).json({
            success: true,
            message: "تم رفض العرض"
        });

    } catch (err) {
        console.error("Reject Error:", err);
        res.status(500).json({ success: false, error: "حدث خطأ أثناء الرفض" });
    }
});

    return router;
};