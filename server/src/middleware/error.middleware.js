/**
 * PrepPilot - Centralized Error Handling Middleware
 * Catches all unhandled exceptions, Mongoose validation errors, and operational errors.
 */

const { sendError } = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Log error stack in development mode
  if (process.env.NODE_ENV !== 'test') {
    console.error(`💥 [Error caught by errorHandler]:`, err);
  }

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    message = `Resource not found with id: ${err.value}`;
    statusCode = 404;
  }

  // 2. Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An account with this ${field} already exists.`;
    statusCode = 409;
  }

  // 3. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    message = 'Validation failed';
    statusCode = 400;
    errors = Object.values(err.errors).map((val) => val.message);
  }

  // 4. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid authentication token.';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Authentication token expired.';
    statusCode = 401;
  }

  return sendError(res, message, statusCode, errors);
};

// 404 Route Not Found middleware
const notFoundHandler = (req, res, next) => {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

module.exports = {
  errorHandler,
  notFoundHandler
};
