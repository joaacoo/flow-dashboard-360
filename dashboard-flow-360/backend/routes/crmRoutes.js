const express = require('express');
const router = express.Router();
const crmController = require('../controllers/crmController');
const verifyToken = require('../middleware/auth');

router.get('/oportunidades', verifyToken, crmController.getOportunidades);
router.get('/casos', verifyToken, crmController.getCasos);

module.exports = router;
