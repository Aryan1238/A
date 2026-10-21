/**
 * PrepPilot - JWT Authentication Middleware
 * Protects private endpoints by verifying bearer token in the Authorization header.
 * Attaches the authenticated user to `req.user`.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { sendError } = require('../utils/responseHandler');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Access denied. Please log in to access this resource.', 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'preppilot_super_secret_jwt_key_for_college_project_2026'
    );

    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return sendError(res, 'User belonging to this token no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Session expired. Please log in again.', 401);
    }
    return sendError(res, 'Invalid token. Authorization failed.', 401);
  }
};

module.exports = {
  protect
};
