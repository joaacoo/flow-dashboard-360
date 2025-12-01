const { sql, poolPromise } = require('../config/db');

const getEnvios = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM envios');
        // Parse JSON stages
        const envios = result.recordset.map(envio => ({
            ...envio,
            etapas: JSON.parse(envio.etapas || '[]')
        }));
        res.json(envios);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getCamiones = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM camiones');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getLogisticaStats = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                (SELECT COUNT(*) FROM envios WHERE estado = 'entregado' AND demorado = 0) * 100.0 / NULLIF(COUNT(*), 0) as entregasATiempo,
                (SELECT COUNT(*) FROM camiones WHERE estado = 'Disponible') as camionesDisponibles,
                (SELECT COUNT(*) FROM envios WHERE estado != 'entregado') as enviosEnCurso
            FROM envios
        `);
        res.json(result.recordset[0] || { entregasATiempo: 0, camionesDisponibles: 0, enviosEnCurso: 0 });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getEnvios,
    getCamiones,
    getLogisticaStats
};
