/**
 * PrepPilot - Multer File Upload Middleware
 * Enforces in-memory PDF uploads with a strict 5MB limit.
 */

const multer = require('multer');
const path = require('path');
const { sendError } = require('../utils/responseHandler');

// Store file as Buffer in memory for direct passing to pdf-parse
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (ext === '.pdf' && (mime === 'application/pdf' || mime === 'application/x-pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF files are supported.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter
});

/**
 * Express middleware wrapper to catch Multer errors gracefully
 */
const uploadResumeMiddleware = (req, res, next) => {
  const singleUpload = upload.single('resume');

  singleUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return sendError(res, 'File too large. Maximum allowed resume size is 5MB.', 400);
      }
      return sendError(res, `Upload error: ${err.message}`, 400);
    } else if (err) {
      return sendError(res, err.message, 400);
    }
    next();
  });
};

module.exports = {
  uploadResumeMiddleware
};
