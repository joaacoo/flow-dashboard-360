const express = require('express');
const router = express.Router();
const tangoController = require('../controllers/tangoController');

router.post('/sync/products', tangoController.syncProducts);
router.post('/sync/clients', tangoController.syncClients);
router.get('/logs', tangoController.getLogs);

module.exports = router;
