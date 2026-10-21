/**
 * PrepPilot - Auth Controller
 * Handles user registration, authentication, JWT issuance, and profile fetching.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Helper to generate signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'preppilot_super_secret_jwt_key_for_college_project_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new student/candidate user
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Please provide name, email, and password.', 400);
    }

    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters long.', 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return sendError(res, 'An account with this email address already exists.', 409);
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password
    });

    const token = generateToken(user._id);

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Please provide email and password.', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    const token = generateToken(user._id);

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged-in user profile
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (clears client session)
 * @access  Public
 */
const logout = async (req, res) => {
  return sendSuccess(res, null, 'Logged out successfully');
};

module.exports = {
  register,
  login,
  getMe,
  logout
};
