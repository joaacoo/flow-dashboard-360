const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/auth');

// Obtener todas las notificaciones
router.get('/', verifyToken, notificationController.getNotifications);

// Obtener solo notificaciones no leídas
router.get('/unread', verifyToken, notificationController.getUnreadNotifications);

// Marcar notificación como leída
router.patch('/:id/read', verifyToken, notificationController.markAsRead);

// Marcar todas como leídas
router.patch('/read-all', verifyToken, notificationController.markAllAsRead);

// Crear notificación (para reglas de negocio)
router.post('/', verifyToken, notificationController.createNotification);

// Test de notificación
router.post('/test', verifyToken, notificationController.testNotification);

module.exports = router;
