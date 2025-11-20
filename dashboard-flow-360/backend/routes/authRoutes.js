const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.get('/me', verifyToken, authController.me);
router.get('/users', authController.listUsers); // Temporal para debugging

module.exports = router;
