const { poolPromise } = require('../config/db');

const getOrdenes = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM produccion WHERE estado != 'FINALIZADO'");
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getInsumos = async (req, res) => {
    // Mock data for missing inputs
    res.json([
        { insumo: 'Materia Prima X', faltante: 50, unidad: 'kg' },
        { insumo: 'Envase Y', faltante: 200, unidad: 'unidades' }
    ]);
};

module.exports = { getOrdenes, getInsumos };
