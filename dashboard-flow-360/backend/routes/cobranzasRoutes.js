const express = require('express');
const router = express.Router();
const { registrarPago, getAgingReport, getTopDeudores } = require('../controllers/cobranzasController');
const { verifyToken } = require('../middleware/auth');

router.post('/pago', verifyToken, registrarPago);
router.get('/aging-report', verifyToken, getAgingReport);
router.get('/top-deudores', verifyToken, getTopDeudores);

module.exports = router;
