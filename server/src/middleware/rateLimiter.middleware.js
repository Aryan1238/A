/**
 * PrepPilot - Rate Limiting Middleware
 * Protects server resources and Gemini API quotas against abuse.
 */

const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/responseHandler');

const isTestEnv = process.env.NODE_ENV === 'test';

// General API Rate Limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTestEnv ? 1000 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'Too many requests from this IP address, please try again in 15 minutes.',
      429
    );
  }
});

// Stricter Rate Limiter for AI-intensive endpoints (Resume Analysis & Mock Interview generation)
const aiRouteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTestEnv ? 1000 : 40,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'AI request limit reached. Please wait a few minutes before submitting another analysis or interview answer.',
      429
    );
  }
});

module.exports = {
  generalLimiter,
  aiRouteLimiter
};
