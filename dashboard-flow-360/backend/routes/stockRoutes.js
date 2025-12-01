const express = require('express');
const router = express.Router();
const { getInventario, crearProducto, actualizarProducto, eliminarProducto, getStockSummary } = require('../controllers/stockController');
const { verifyToken } = require('../middleware/auth');

router.get('/inventario', verifyToken, getInventario);
router.get('/resumen', verifyToken, getStockSummary);
router.post('/producto', verifyToken, crearProducto);
router.put('/producto/:id', verifyToken, actualizarProducto);
router.delete('/producto/:id', verifyToken, eliminarProducto);

module.exports = router;
