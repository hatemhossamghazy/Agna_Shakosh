const express = require("express");

/**
 * RENT + equipment routes. Expects a connected `pg` Client from server.js.
 * Mount at `/RENT` and/or `/api` (see server.js) — e.g. GET /api/equipment.
 */
function createRentRouter(client) {
    const router = express.Router();

    function toNullableString(value) {
        if (value === undefined || value === null) return null;
        const s = String(value).trim();
        return s === "" ? null : s;
    }

    function toNullableNumber(value) {
        if (value === undefined || value === null || value === "") return null;
        const n = Number(value);
        if (!Number.isFinite(n)) return null;
        return n;
    }

    // ============================================
    // GET /equipment?type=rent|sell|both
    // Mounted at /api → /api/equipment?type=...
    // ============================================
//     router.get("/equipment", async (req, res) => {
//         const ALLOWED = ["rent", "sell", "both"];
//         const raw = req.query.type;

//         let filterMode;
//         if (raw === undefined || raw === null || String(raw).trim() === "") {
//             filterMode = "all";
//         } else {
//             const t = String(raw).trim().toLowerCase();
//             if (!ALLOWED.includes(t)) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `Invalid type. Allowed values are: ${ALLOWED.join(", ")}`,
//                 });
//             }
//             filterMode = t;
//         }

//         const columns = `
//             equipment_id,
//             name,
//             description,
//             price_per_day,
//             sale_price,
//             type,
//             status,
//             seller_id,
//             category,
//             image_url`;

//         let sql = `SELECT ${columns} FROM public.equipment`;
//         const params = [];

//         try {
//             if (filterMode === "all") {
//                 sql += ` ORDER BY equipment_id DESC`;
//             } else if (filterMode === "rent") {
//                 params.push("rent", "both");
//                 sql += ` WHERE type IN ($1, $2) ORDER BY equipment_id DESC`;
//             } else if (filterMode === "sell") {
//                 params.push("sell", "both");
//                 sql += ` WHERE type IN ($1, $2) ORDER BY equipment_id DESC`;
//             } else if (filterMode === "both") {
//                 params.push("both");
//                 sql += ` WHERE type = $1 ORDER BY equipment_id DESC`;
//             }

//             const { rows } = await client.query(sql, params);

//             return res.status(200).json({
//                 success: true,
//                 count: rows.length,
//                 data: rows,
//             });
//         } catch (err) {
//             console.error("GET /equipment error:", err);
//             return res.status(500).json({
//                 success: false,
//                 message: err.message || "Failed to fetch equipment",
//             });
//         }
//     });
// // ============================================
// // GET /equipment?category=...
// // Mounted at /api → /api/equipment?category=...
// // ============================================
//     router.get("/equipment", async (req, res) => {
//     const { category } = req.query;

//     try {
//         let query = `
//             SELECT * FROM public.equipment
//         `;
//         let params = [];

//         if (category) {
//             query += ` WHERE LOWER(category) = LOWER($1)`;
//             params.push(category);
//         }

//         query += ` ORDER BY equipment_id DESC`;

//         const { rows } = await client.query(query, params);

//         res.json({
//             success: true,
//             data: rows
//         });

//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// });

router.get("/equipment", async (req, res) => {
    const { category } = req.query;

    try {
        let sql = `
            SELECT *
            FROM public.equipment
            WHERE type IN ('sell', 'both')
        `;

        const params = [];

        // 🔵 category filter (optional)
        if (category && category !== "الكل") {
            sql += ` AND LOWER(category) = LOWER($1)`;
            params.push(category);
        }

        sql += ` ORDER BY equipment_id DESC`;

        const { rows } = await client.query(sql, params);

        return res.json({
            success: true,
            data: rows
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
    // ============================================
    // POST /equipment — create equipment
    // ============================================
    router.post("/equipment", async (req, res) => {
        try {
            const {
                name,
                description,
                price_per_day,
                sale_price,
                type,
                status,
                seller_id,
                category,
                image_url,
            } = req.body;

            const errors = [];
            const normalizedType = toNullableString(type)?.toLowerCase();
            const allowedTypes = ["rent", "sell", "both"];

            if (!toNullableString(name)) {
                errors.push({ field: "name", message: "name is required" });
            }

            if (!normalizedType || !allowedTypes.includes(normalizedType)) {
                errors.push({ field: "type", message: "type must be one of: 'rent', 'sell', 'both'" });
            }

            const sellerId = Number(seller_id);
            if (!Number.isInteger(sellerId) || sellerId <= 0) {
                errors.push({ field: "seller_id", message: "seller_id must be a valid positive integer" });
            }

            const rentPrice = toNullableNumber(price_per_day);
            const sellPrice = toNullableNumber(sale_price);

            if (normalizedType === "rent" || normalizedType === "both") {
                if (rentPrice === null || rentPrice < 0) {
                    errors.push({
                        field: "price_per_day",
                        message: "price_per_day is required and must be >= 0 for type 'rent' or 'both'",
                    });
                }
            }

            if (normalizedType === "sell" || normalizedType === "both") {
                if (sellPrice === null || sellPrice < 0) {
                    errors.push({
                        field: "sale_price",
                        message: "sale_price is required and must be >= 0 for type 'sell' or 'both'",
                    });
                }
            }

            if (errors.length > 0) {
                return res.status(400).json({ success: false, errors });
            }

            const sellerCheck = await client.query("SELECT user_id FROM public.seller WHERE user_id = $1", [sellerId]);
            if (sellerCheck.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "seller not found. seller_id must exist in public.seller.user_id",
                });
            }

            const insertQuery = `
                INSERT INTO public.equipment (
                    name, description, price_per_day, sale_price,
                    type, status, seller_id, category, image_url
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                RETURNING
                    equipment_id, name, description, price_per_day, sale_price,
                    type, status, seller_id, category, image_url`;

            const values = [
                toNullableString(name),
                toNullableString(description),
                rentPrice,
                sellPrice,
                normalizedType,
                toNullableString(status) || "available",
                sellerId,
                toNullableString(category),
                toNullableString(image_url),
            ];

            const result = await client.query(insertQuery, values);

            return res.status(201).json({
                success: true,
                message: "equipment created successfully",
                data: result.rows[0],
            });
        } catch (err) {
            console.error("Create equipment error:", err);
            return res.status(500).json({
                success: false,
                error: "Failed to create equipment",
            });
        }
    });

    return router;
}

module.exports = createRentRouter;


if (require.main === module) {
    require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
    const { Client } = require("pg");

    const app = express();
    const port = Number(process.env.PORT) || 3000;

    const db = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    app.use(express.json());
    app.get("/", (_req, res) => {
        res.json({ ok: true, hint: "GET /api/equipment?type=rent|sell|both" });
    });

    db.connect()
        .then(() => {
            console.log("Connected to PostgreSQL");
            app.use("/api", createRentRouter(db));
            app.listen(port, () => {
                console.log(`Listening on http://localhost:${port} — try GET /api/equipment`);
            });
        })
        .catch((err) => {
            console.error("Database connection error:", err);
            process.exit(1);
        });
}

