const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// حط بياناتك هنا مباشرة بين علامات التنصيص
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// للتأكد إن القيم دخلت الملف فعلاً
console.log("Cloudinary Configured with Name:", cloudinary.config().cloud_name ? "✅ Done" : "❌ Failed");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'agna_shakosh_reviews',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const uploadCloud = multer({ storage: storage });

module.exports = uploadCloud;
