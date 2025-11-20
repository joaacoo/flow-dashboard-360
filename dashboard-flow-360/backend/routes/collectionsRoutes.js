const express = require('express');
const router = express.Router();
const collectionsController = require('../controllers/collectionsController');
const verifyToken = require('../middleware/auth');

router.get('/vencimientos', verifyToken, collectionsController.getVencimientos);
router.get('/resumen', verifyToken, collectionsController.getResumen);
router.post('/pago', verifyToken, collectionsController.registrarPago);

module.exports = router;
