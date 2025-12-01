const express = require('express');
const router = express.Router();
const { getMaquinas, getOrdenesProduccion, getProduccionStats } = require('../controllers/produccionController');
const { verifyToken } = require('../middleware/auth');

router.get('/maquinas', verifyToken, getMaquinas);
router.get('/ordenes', verifyToken, getOrdenesProduccion);
router.get('/stats', verifyToken, getProduccionStats);

module.exports = router;
