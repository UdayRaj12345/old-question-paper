const multer = require('multer');
const path = require('path');

// Storage config (in memory for Cloudinary upload, or disk for local)
const storage = multer.memoryStorage();

// File filter (accept only PDF)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Not a PDF! Please upload only PDF files.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
});

module.exports = upload;
