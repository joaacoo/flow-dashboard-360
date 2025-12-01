const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const { verifyToken } = require('../middleware/auth');

router.get('/pedidos', verifyToken, ventasController.getPedidos);
router.get('/resumen', verifyToken, ventasController.getResumen);
router.get('/dashboard', verifyToken, ventasController.getDashboardData);
router.post('/pedido', verifyToken, ventasController.crearPedido);

module.exports = router;
