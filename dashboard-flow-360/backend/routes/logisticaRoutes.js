const express = require('express');
const router = express.Router();
const { getEnvios, getCamiones, getLogisticaStats } = require('../controllers/logisticaController');
const { verifyToken } = require('../middleware/auth');

router.get('/envios', verifyToken, getEnvios);
router.get('/camiones', verifyToken, getCamiones);
router.get('/stats', verifyToken, getLogisticaStats);

module.exports = router;
