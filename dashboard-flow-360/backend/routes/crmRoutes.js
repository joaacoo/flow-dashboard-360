const express = require('express');
const router = express.Router();
const { getLeads, createLead, updateLead, getDashboardStats } = require('../controllers/crmController');
const { verifyToken } = require('../middleware/auth');

router.get('/leads', verifyToken, getLeads);
router.post('/leads', verifyToken, createLead);
router.put('/leads/:id', verifyToken, updateLead);
router.get('/stats', verifyToken, getDashboardStats);

module.exports = router;
