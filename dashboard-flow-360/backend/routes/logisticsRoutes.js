const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// Mock controller for logistics as it wasn't fully detailed in schema but required in prompt
router.get('/rutas', verifyToken, (req, res) => {
    res.json([
        { id: 1, ruta: 'Zona Norte', estado: 'En camino', pedidos: 5 },
        { id: 2, ruta: 'Zona Sur', estado: 'Pendiente', pedidos: 3 }
    ]);
});

module.exports = router;
