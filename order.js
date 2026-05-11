const express = require("express");
const { authenticateToken } = require("../middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
module.exports = (client) => {
    const router = express.Router();
router.get("/addresses", authenticateToken, async (req, res) => {
    try {

        const userId = req.user.id;

        // جلب العناوين من طلبات الإيجار
        const rentalAddresses = await client.query(`
            SELECT DISTINCT delivery_address
            FROM rental_order
            WHERE customer_id = $1
              AND delivery_address IS NOT NULL
              AND delivery_address != ''
        `, [userId]);

        // جلب العناوين من طلبات البيع
        const saleAddresses = await client.query(`
            SELECT DISTINCT delivery_address
            FROM sale_order
            WHERE customer_id = $1
              AND delivery_address IS NOT NULL
              AND delivery_address != ''
        `, [userId]);

        // دمج العناوين
        const allAddresses = [
            ...rentalAddresses.rows,
            ...saleAddresses.rows
        ];

        // إزالة التكرار
        const uniqueAddresses = Array.from(
            new Set(allAddresses.map(a => a.delivery_address))
        ).map((address, index) => ({
            address_id: index + 1,
            delivery_address: address
        }));

        res.json({
            success: true,
            addresses: uniqueAddresses
        });

    } catch (err) {

        console.error("Get Addresses Error:", err);

        res.status(500).json({
            success: false,
            error: "خطأ في جلب العناوين"
        });

    }
});

router.post(
  "/confirm",
  authenticateToken,
  upload.single("transfer_image"),
  async (req, res) => {

    try {

      const customerId = req.user.id;

      const { address, payment_method, items } = req.body;

      if (!address) {
        return res.status(400).json({ success: false, error: "العنوان مطلوب" });
      }

      if (!payment_method) {
        return res.status(400).json({ success: false, error: "طريقة الدفع مطلوبة" });
      }

      if (!items) {
        return res.status(400).json({ success: false, error: "لا يوجد منتجات" });
      }

      const parsedItems = JSON.parse(items);

      if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
        return res.status(400).json({ success: false, error: "الكارت فارغ" });
      }

      // =========================
      // START TRANSACTION (IMPORTANT)
      // =========================
      await client.query("BEGIN");

      let totalAmount = 0;

      for (const item of parsedItems) {

        const equipmentResult = await client.query(
          `SELECT sale_price FROM equipment WHERE equipment_id = $1`,
          [item.equipment_id]
        );

        if (equipmentResult.rows.length === 0) {
          throw new Error("المعدة غير موجودة");
        }

        const price = equipmentResult.rows[0].sale_price;
        totalAmount += price * item.quantity;
      }

      // =========================
      // PAYMENT INSERT
      // =========================
      const paymentResult = await client.query(
        `
        INSERT INTO payment (amount, type, status, customer_id)
        VALUES ($1, $2, $3, $4)
        RETURNING payment_id
        `,
        [
          totalAmount,
          payment_method,
          payment_method === "cash_on_delivery"
            ? "pending"
            : "waiting_review",
          customerId
        ]
      );

      const paymentId = paymentResult.rows[0].payment_id;

      const insertedOrders = [];

      for (const item of parsedItems) {

        const equipmentResult = await client.query(
          `SELECT sale_price FROM equipment WHERE equipment_id = $1`,
          [item.equipment_id]
        );

        const price = equipmentResult.rows[0].sale_price;

        const orderResult = await client.query(
          `
          INSERT INTO sale_order
          (price, status, equipment_id, payment_id, customer_id, quantity, delivery_address)
          VALUES ($1,$2,$3,$4,$5,$6,$7)
          RETURNING *
          `,
          [
            price * item.quantity,
            "pending",
            item.equipment_id,
            paymentId,
            customerId,
            item.quantity,
            address
          ]
        );

        insertedOrders.push(orderResult.rows[0]);
      }

      // =========================
      // COMMIT
      // =========================
      await client.query("COMMIT");

      return res.status(201).json({
        success: true,
        message: "تم إنشاء الطلب بنجاح",
        payment_id: paymentId,
        orders: insertedOrders
      });

    } catch (err) {

      // =========================
      // ROLLBACK
      // =========================
      await client.query("ROLLBACK");

      console.error(err);

      return res.status(500).json({
        success: false,
        error: err.message || "حدث خطأ أثناء إنشاء الطلب"
      });

    } finally {

      // IMPORTANT
      // لو هتستخدم Client global → امسح السطر ده
      // client.release();

    }
  }
);


    return router;
};