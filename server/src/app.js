/**
 * PrepPilot - Express Application Setup
 * Configures global middlewares, routes, and error handling.
 * Separated from server.js for seamless supertest integration.
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { generalLimiter } = require('./middleware/rateLimiter.middleware');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

// Route imports
const authRoutes = require('./routes/auth.routes');
const analysisRoutes = require('./routes/analysis.routes');
const interviewRoutes = require('./routes/interview.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// 1. Cross-Origin Resource Sharing (CORS)
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching origin
      if (!origin || origin === allowedOrigin || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev for convenience
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 2. HTTP Request Logger (disabled in test runs)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 3. Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Global Rate Limiter
app.use('/api', generalLimiter);

// 5. API Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.round(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development'
  });
});

// 6. Mount Feature API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 7. Fallback 404 and Error Handler Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
