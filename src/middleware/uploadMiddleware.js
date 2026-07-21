const multer = require('multer');
const path = require('path');
const fs = require('fs');

const rawUploadsDir = path.join(__dirname, '..', '..', 'uploads', 'raw');

if (!fs.existsSync(rawUploadsDir)) {
  fs.mkdirSync(rawUploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, rawUploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 * 1024 }, // 5GB max per file
});

module.exports = upload;