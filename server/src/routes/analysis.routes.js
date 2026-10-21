/**
 * PrepPilot - Resume Analysis Routes
 * Express router mounting resume PDF upload, ATS analysis, and history querying endpoints.
 */

const express = require('express');
const router = express.Router();
const {
  uploadAndAnalyze,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis
} = require('../controllers/analysis.controller');
const { protect } = require('../middleware/auth.middleware');
const { uploadResumeMiddleware } = require('../middleware/upload.middleware');
const { aiRouteLimiter } = require('../middleware/rateLimiter.middleware');

// All analysis endpoints are protected by JWT authentication
router.use(protect);

router.post('/upload', aiRouteLimiter, uploadResumeMiddleware, uploadAndAnalyze);
router.get('/', getAnalyses);
router.get('/:id', getAnalysisById);
router.delete('/:id', deleteAnalysis);

module.exports = router;
