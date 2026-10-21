/**
 * PrepPilot - Mock Interview Routes
 * Express router mounting session generation, answer evaluations, and report retrieval.
 */

const express = require('express');
const router = express.Router();
const {
  startInterview,
  submitAnswer,
  getInterviews,
  getInterviewById,
  deleteInterview
} = require('../controllers/interview.controller');
const { protect } = require('../middleware/auth.middleware');
const { aiRouteLimiter } = require('../middleware/rateLimiter.middleware');

// All interview endpoints are protected by JWT authentication
router.use(protect);

router.post('/start', aiRouteLimiter, startInterview);
router.post('/:id/answer', aiRouteLimiter, submitAnswer);
router.get('/', getInterviews);
router.get('/:id', getInterviewById);
router.delete('/:id', deleteInterview);

module.exports = router;
