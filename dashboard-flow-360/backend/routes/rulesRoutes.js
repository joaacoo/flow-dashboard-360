const express = require('express');
const router = express.Router();
const rulesController = require('../controllers/rulesController');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, rulesController.createRule);
router.get('/', verifyToken, rulesController.getRules);
router.put('/:id', verifyToken, rulesController.updateRule);
router.delete('/:id', verifyToken, rulesController.deleteRule);

module.exports = router;
