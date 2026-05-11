const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

/** Digits only, Egyptian local format 01xxxxxxxxx */
function normalizeEgyptianMobile(input) {
    if (input == null || typeof input !== "string") return "";
    let d = input.replace(/\D/g, "");
    if (d.startsWith("20")) d = d.slice(2);
    if (d.length === 10 && d.startsWith("1")) d = `0${d}`;
    return d;
}

function isValidEgyptianMobile(digits) {
    return /^01[0125][0-9]{8}$/.test(digits);
}

/** Map UI / API values to DB role */
function normalizeUserType(raw) {
    if (raw == null) return null;
    const s = String(raw).trim().toLowerCase();
    const map = {
        client: "client",
        customer: "client",
        عميل: "client",
        craftsman: "worker", 
        worker: "worker",
        صنايعي: "worker",
        // --- ADD THESE TWO LINES ---
        seller: "seller",    
        تاجر: "seller"
    };
    return map[s] || null;
}

function splitFullName(fullName) {
    const t = String(fullName || "").trim().replace(/\s+/g, " ");
    if (!t) return { fname: "", lname: "" };
    const parts = t.split(" ");
    if (parts.length === 1) return { fname: parts[0], lname: "" };
    return { fname: parts[0], lname: parts.slice(1).join(" ") };
}

const USER_SELECT_WITH_ROLE = `
    SELECT u.user_id, u.fname, u.lname, u.email, u.password, u.phone,
           CASE
               WHEN c.user_id IS NOT NULL THEN 'client'
               WHEN w.user_id IS NOT NULL THEN 'worker'
               WHEN s.user_id IS NOT NULL THEN 'seller'
               ELSE 'client'
           END AS app_role
    FROM public.users u
    LEFT JOIN public.customer c ON c.user_id = u.user_id
    LEFT JOIN public.worker w ON w.user_id = u.user_id
    LEFT JOIN public.seller s ON s.user_id = u.user_id
`;

module.exports = (db) => {
    const router = express.Router();

    /**
     * POST /register — matches mobile registration form:
     * fullName, mobileNumber, userType (client | craftsman + common aliases),
     * password, confirmPassword
     */
    router.post("/register", async (req, res) => {
        try {
            const { fullName, mobileNumber, userType, password, confirmPassword, email, jobType } = req.body;

            const errors = [];
            if (!fullName || !String(fullName).trim()) errors.push({ field: "fullName", message: "الاسم بالكامل مطلوب" });
            const phone = normalizeEgyptianMobile(mobileNumber || "");
            if (!phone) errors.push({ field: "mobileNumber", message: "رقم الموبايل مطلوب" });
            else if (!isValidEgyptianMobile(phone)) errors.push({ field: "mobileNumber", message: "رقم موبايل مصري غير صالح (مثال: 01xxxxxxxxx)" });
            const accountKind = normalizeUserType(userType);
            if (!accountKind) errors.push({ field: "userType", message: "نوع الحساب غير صالح (عميل أو صنايعي)" });

            if (!password || String(password).length < 8) {
                errors.push({ field: "password", message: "كلمة المرور يجب ألا تقل عن 8 أحرف" });
            }
            if (password !== confirmPassword) {
                errors.push({ field: "confirmPassword", message: "تأكيد الباسورد غير مطابق" });
            }
            if (!email) {
                errors.push({ field: "email", message: "email is required" });
            }

            if (errors.length) {
                return res.status(400).json({ message: "بيانات غير صالحة", errors });
            }

            const dup = await db.query(`SELECT user_id FROM public.users WHERE phone = $1`, [phone]);
            if (dup.rows.length > 0) {
                return res.status(409).json({
                    message: "رقم الموبايل مسجل مسبقاً",
                    errors: [{ field: "mobileNumber", message: "هذا الرقم مستخدم بالفعل" }],
                });
            }
            const emailDup = await db.query(`SELECT user_id FROM public.users WHERE email = $1`, [email]);
            if (emailDup.rows.length > 0) {
                return res.status(409).json({ message: "تعارض في البيانات", errors: [{ field: "email", message: "this email already exists" }] });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const { fname, lname } = splitFullName(fullName);

            await db.query("BEGIN");
            const insertedUser = await db.query(
                `INSERT INTO public.users (fname, lname, email, password, phone, role)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING user_id`,
                [fname || null, lname || null, email, hashedPassword, phone, accountKind]
            );
            const userId = insertedUser.rows[0].user_id;
            
            // 2. Insert into the specific Role Table based on accountKind
            if (accountKind === "client") {
                // Initialize customer stats to 0 as per image_9502c2.png
                await db.query(
                    `INSERT INTO public.customer (user_id, total_spent, total_orders) 
                     VALUES ($1, 0, 0)`, 
                    [userId]
                );
            } 
           else if (accountKind === "worker") {
             errors.push({ field: "jobType", message: "يجب اختيار نوع الصنعة" });
    await db.query(
  `INSERT INTO public.worker (user_id, job_type) 
   VALUES ($1, $2)`,
  [userId, jobType]
);

}
            else if (accountKind === "seller") {
                // Initialize seller stats to 0 as per image_9502c2.png
                await db.query(
                    `INSERT INTO public.seller (user_id, rating, total_sales, total_rentals) 
                     VALUES ($1, 0, 0, 0)`, 
                    [userId]
                );
            }
            
            await db.query("COMMIT");

            return res.status(201).json({
                message: "تم إنشاء الحساب بنجاح",
                user: { userId, phone, userType: accountKind, fullName: String(fullName).trim() },
            });
        } catch (err) {
            try {
                await db.query("ROLLBACK");
            } catch (_) {
                // ignore rollback failure
            }
            console.error("register error:", err);
            return res.status(500).json({ message: err.message || "خطأ في الخادم" });
        }
    });

    router.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "email and password are required" });
            }

            const result = await db.query(`${USER_SELECT_WITH_ROLE} WHERE u.email = $1`, [String(email).trim()]);

            if (result.rows.length === 0) {
                return res.status(400).json({ message: "بيانات الدخول غير صحيحة" });
            }

            const user = result.rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).json({ message: "بيانات الدخول غير صحيحة" });
            }

            const token = jwt.sign(
                { id: user.user_id, email: user.email, role: user.app_role || "client" },
                SECRET_KEY || "secret123",
                { expiresIn: "1h" }
            );

            return res.status(200).json({ message: "تم تسجيل الدخول", token });
        } catch (err) {
            console.error("login error:", err);
            return res.status(500).json({ message: err.message || "خطأ في الخادم" });
        }
    });

    return router;
};
