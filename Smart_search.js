const express = require('express');
const axios = require('axios');
const Redis = require('ioredis');

module.exports = function(client) {
    const router = express.Router();
    const redis = new Redis();
    const API_KEY = process.env.GEMINI_API_KEY;

    const PRIMARY_MODEL = "gemini-2.5-flash"; 
    const FALLBACK_MODEL = "gemini-2.0-flash-lite-001"; 

    const getUrl = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const workerCategories = ["سباكة", "كهرباء", "نجارة", "نقاشة", "بلاط وسيراميك", "محارة", "حدادة", "زجاج", "جبس بورد", "تركيب رخام وجرانيت", "عزل أسطح", "تركيب ستائر", "تنجيد", "صيانة أجهزة منزلية", "تكييف وتبريد", "تركيب كاميرات مراقبة", "شبكات إنترنت", "تنظيف منازل", "مكافحة حشرات", "نقل عفش", "صيانة مصاعد", "تركيب مطابخ", "تركيب أرضيات", "لحام", "صيانة غسالات", "صيانة ثلاجات", "صيانة بوتاجازات", "تركيب فلاتر مياه", "تركيب سخانات"];

    // Note: The path is '/' because it's prefixed by '/Smart_search' in the main server
    router.post('/', async (req, res) => {
        const { query } = req.body;
        if (!query) return res.status(400).json({ error: "الرجاء إرسال query" });

        const cacheKey = `search:${query.trim().toLowerCase()}`;

        try {
            const cachedData = await redis.get(cacheKey);
            if (cachedData) return res.json({ success: true, analysis: JSON.parse(cachedData), source: 'cache' });

            const payload = {
                system_instruction: {
                    parts: [{
                        text: `أنت خبير تصنيف بيانات لموقع خدمات فنية في مصر. حدد النية والقسم. الأقسام: [${workerCategories.join(", ")}]. إذا كان الكلام غير مفهوم، ضع "لا يوجد" في الحقلين.`
                    }]
                },
                contents: [{ parts: [{ text: query }] }],
                generationConfig: {
                    temperature: 0.1,
                    response_mime_type: "application/json",
                    response_schema: {
                        type: "OBJECT",
                        required: ["intent", "category"],
                        properties: {
                            intent: { type: "STRING", enum: ["products", "workers", "both"] },
                            category: {
                                type: "OBJECT",
                                required: ["worker", "product"],
                                properties: {
                                    worker: { type: "STRING" },
                                    product: { type: "STRING" }
                                }
                            }
                        }
                    }
                }
            };

            let response;
            let currentModelUsed = PRIMARY_MODEL;
            const maxRetries = 2;

            for (let i = 0; i <= maxRetries; i++) {
                try {
                    response = await axios.post(getUrl(currentModelUsed), payload, { timeout: 10000 });
                    if (response.data) break;
                } catch (err) {
                    const status = err.response?.status;
                    if (status === 429 || status === 503 || status === 500) {
                        currentModelUsed = FALLBACK_MODEL;
                        if (i < maxRetries) await wait(1000);
                    } else {
                        throw err;
                    }
                }
            }

            const aiText = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!aiText) throw new Error("Empty response from AI");
            const parsed = JSON.parse(aiText);

            if (parsed.category.worker === "لا يوجد" && parsed.category.product === "لا يوجد") {
                return res.json({ success: false, message: "محتاج نعرف نوع الشغل بالظبط او المنتج", analysis: parsed });
            }

            // --- Database Example ---
            // You can now use the 'client' passed from the server file
            // await client.query('INSERT INTO search_history (query, intent) VALUES ($1, $2)', [query, parsed.intent]);

            await redis.set(cacheKey, JSON.stringify(parsed), 'EX', 86400);

            res.json({ success: true, analysis: parsed, source: 'api', model: currentModelUsed });

        } catch (error) {
            const errorDetail = error.response?.data?.error?.message || error.message;
            console.error("Critical Error:", errorDetail);
            res.status(500).json({ error: "Service unavailable", details: errorDetail });
        }
    });

    return router;
};