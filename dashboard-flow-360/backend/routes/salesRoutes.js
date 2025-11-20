const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const verifyToken = require('../middleware/auth');

router.get('/resumen', verifyToken, salesController.getResumen);
router.get('/top-clientes', verifyToken, salesController.getTopClientes);
router.get('/top-productos', verifyToken, salesController.getTopProductos);
router.get('/pedidos', verifyToken, salesController.getPedidos);
router.post('/venta', verifyToken, salesController.crearVenta);

module.exports = router;
