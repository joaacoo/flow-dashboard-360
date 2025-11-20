const { poolPromise } = require('../config/db');

const getOportunidades = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM crm_oportunidades WHERE etapa != 'CERRADO_GANADO' AND etapa != 'CERRADO_PERDIDO'");
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCasos = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM crm_casos WHERE estado != 'RESUELTO'");
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOportunidades, getCasos };
