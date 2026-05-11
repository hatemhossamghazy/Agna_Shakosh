const express = require('express');
const app = express();
app.use(express.json());
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log("API Key loaded:", API_KEY ? API_KEY.substring(0, 4) + "..." : "Not Found");

app.post('/api/smart-search', async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "الرجاء إرسال query" });
// const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
const workerCategories = ["سباكة", "كهرباء", "نجارة", "نقاشة", "بلاط وسيراميك", "محارة", "حدادة", "ألوميتال",
        "زجاج", "جبس بورد", "تركيب رخام وجرانيت", "عزل أسطح", "تركيب ستائر", "تنجيد", "صيانة أجهزة منزلية",
        "تكييف وتبريد", "تركيب كاميرات مراقبة", "شبكات إنترنت", "تنظيف منازل", "مكافحة حشرات", "نقل عفش",
        "صيانة مصاعد", "تركيب مطابخ", "تركيب أرضيات", "لحام", "صيانة غسالات", "صيانة ثلاجات", "صيانة بوتاجازات", 
        "تركيب فلاتر مياه", "تركيب سخانات"];
const payload = {
    contents: [
        {
            role: "user",
            parts: [{
                text: `
أنت مساعد ذكي لموقع خدمات فنية في مصر.
حلل النص وارجع JSON فقط بدون أي شرح.

قائمة الأقسام:
[${workerCategories.join(", ")}]

التنسيق المطلوب:
{
  "intent": "products | workers | both",
  "category": { "worker": "اسم القسم", "product": "اسم المنتج" },
  "keywords": []
}

النص:
${query}
                `
            }]
        }
    ],
    generationConfig: {
        temperature: 0.1
    }
};
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Google Error:", result);
            return res.status(response.status).json(result);
        }

        // في الـ JSON Mode، الرد بييجي نظيف جداً
       let aiText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

if (!aiText) {
    return res.status(500).json({ error: "AI response invalid", result });
}

// 🔥 تنظيف الـ markdown
aiText = aiText
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

let parsed;
try {
    parsed = JSON.parse(aiText);
} catch (e) {
    console.error("Raw AI response:", aiText);
    return res.status(500).json({ error: "Invalid JSON from AI" });
}

res.json({
    success: true,
    analysis: parsed
});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(3000, () => console.log("🚀 THE SERVER START SUCCESSFULLY IN File name new.js(npm run startt)..."));