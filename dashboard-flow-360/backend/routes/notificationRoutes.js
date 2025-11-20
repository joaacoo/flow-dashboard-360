const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const verifyToken = require('../middleware/auth');

router.post('/test', verifyToken, notificationController.testNotification);

module.exports = router;
