/**
 * PrepPilot - Auth Routes
 * Express router mounting authentication endpoints.
 */

const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', logout);

module.exports = router;
