const express = require('express');
const router = express.Router();
const { getReglas, crearRegla, actualizarRegla, toggleRegla, eliminarRegla } = require('../controllers/reglasController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, getReglas);
router.post('/', verifyToken, crearRegla);
router.put('/:id', verifyToken, actualizarRegla);
router.patch('/:id/toggle', verifyToken, toggleRegla);
router.delete('/:id', verifyToken, eliminarRegla);

module.exports = router;
