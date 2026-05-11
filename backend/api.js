const express = require('express');
const axios = require('axios');
const Redis = require('ioredis');
require('dotenv').config();

const app = express();
app.use(express.json());

const redis = new Redis();
const API_KEY = process.env.GEMINI_API_KEY;

/** 
 * 1. FIXED MODEL NAMES 
 * We remove the "models/" prefix from the string because the URL helper 
 * handles the pathing. Using the specific stable versions from your list.
 */
const PRIMARY_MODEL = "gemini-2.5-flash"; 
const FALLBACK_MODEL = "gemini-2.0-flash-lite-001"; 

// 2. FIXED URL - This creates the standard: .../v1beta/models/gemini-2.5-flash
const getUrl = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

const workerCategories = ["سباكة", "كهرباء", "نجارة", "نقاشة", "بلاط وسيراميك", "محارة", "حدادة", "ألوميتال", "زجاج", "جبس بورد", "تركيب رخام وجرانيت", "عزل أسطح", "تركيب ستائر", "تنجيد", "صيانة أجهزة منزلية", "تكييف وتبريد", "تركيب كاميرات مراقبة", "شبكات إنترنت", "تنظيف منازل", "مكافحة حشرات", "نقل عفش", "صيانة مصاعد", "تركيب مطابخ", "تركيب أرضيات", "لحام", "صيانة غسالات", "صيانة ثلاجات", "صيانة بوتاجازات", "تركيب فلاتر مياه", "تركيب سخانات"];

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.post('/api/smart-search', async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "الرجاء إرسال query" });

    const cacheKey = `search:${query.trim().toLowerCase()}`;

    try {
        const cachedData = await redis.get(cacheKey);
        if (cachedData) return res.json({ success: true, analysis: JSON.parse(cachedData), source: 'cache' });

        const payload = {
            system_instruction: {
                parts: [{
                    text: `أنت خبير تصنيف بيانات لموقع خدمات فنية في مصر. حدد النية والقسم.
                    الأقسام: [${workerCategories.join(", ")}].
                    إذا كان الكلام غير مفهوم أو لا يحدد خدمة أو منتج بوضوح، ضع "لا يوجد" في حقل worker و حقل product.`
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
                
                // If it's a Quota issue (429) or Server error, switch to Fallback
                if (status === 429 || status === 503 || status === 500) {
                    console.warn(`⚠️ Model ${currentModelUsed} busy (Status ${status}). Switching...`);
                    currentModelUsed = FALLBACK_MODEL;
                    if (i < maxRetries) await wait(1000);
                } else {
                    // For 404 or 401 (Auth), throw immediately to the main catch block
                    throw err;
                }
            }
        }

        const aiText = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!aiText) throw new Error("Empty response from AI");

        const parsed = JSON.parse(aiText);

        // 3. LOGIC UPDATE: Message for unclear queries
        if (parsed.category.worker === "لا يوجد" && parsed.category.product === "لا يوجد") {
            return res.json({
                success: false,
                message: "محتاج نعرف نوع الشغل بالظبط او المنتج",
                analysis: parsed
            });
        }

        await redis.set(cacheKey, JSON.stringify(parsed), 'EX', 86400);

        res.json({
            success: true,
            analysis: parsed,
            source: 'api',
            model: currentModelUsed
        });

    } catch (error) {
        // FIXED: Safe error reading
        const errorDetail = error.response?.data?.error?.message || error.message;
        console.error("Critical Error:", errorDetail);

        res.status(500).json({ 
            error: "Service unavailable", 
            details: errorDetail 
        });
    }
});

app.listen(3000, () => console.log(`🚀 API Live with Gemini 2.5 Support`));