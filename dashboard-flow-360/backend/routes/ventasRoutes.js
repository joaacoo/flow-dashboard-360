const express = require('express');
const router = express.Router();
const { getPedidos, crearPedido } = require('../controllers/ventasController');
const { verifyToken } = require('../middleware/auth');

router.get('/pedidos', verifyToken, getPedidos);
router.post('/pedido', verifyToken, crearPedido);

module.exports = router;
