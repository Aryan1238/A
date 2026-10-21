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

// Trust first hop proxy (essential for rate limiting and accurate client IP behind Render)
app.set('trust proxy', 1);

// 1. Cross-Origin Resource Sharing (CORS)
// Extract origin only (protocol + host + port, no path) from CLIENT_URL
const getAllowedOrigins = () => {
  const origins = new Set([
    'http://localhost:5173',
    'http://localhost:3000'
  ]);

  if (process.env.CLIENT_URL) {
    process.env.CLIENT_URL.split(',').forEach((rawUrl) => {
      const trimmed = rawUrl.trim();
      if (!trimmed) return;
      try {
        origins.add(new URL(trimmed).origin);
      } catch {
        origins.add(trimmed.replace(/\/+$/, ''));
      }
    });
  }

  return origins;
};

const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin matches CLIENT_URL origin or localhost
      if (
        allowedOrigins.has(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }

      // In development, be permissive if not in production
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      return callback(null, false);
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
