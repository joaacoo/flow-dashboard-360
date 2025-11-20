const express = require('express');
const router = express.Router();
const productionController = require('../controllers/productionController');
const verifyToken = require('../middleware/auth');

router.get('/ordenes', verifyToken, productionController.getOrdenes);
router.get('/insumos', verifyToken, productionController.getInsumos);

module.exports = router;
