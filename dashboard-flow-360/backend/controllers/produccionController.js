const { sql, poolPromise } = require('../config/db');

const getMaquinas = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM maquinas');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getOrdenesProduccion = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM ordenes_produccion');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getProduccionStats = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                (SELECT COUNT(*) FROM maquinas WHERE estado = 'operativa') as maquinasOperativas,
                (SELECT COUNT(*) FROM maquinas) as totalMaquinas,
                (SELECT COUNT(*) FROM ordenes_produccion WHERE avance < 100) as ordenesActivas
            FROM maquinas
        `);
        // Just taking the first row as subqueries return single values
        const stats = result.recordset[0] || {};
        res.json({
            maquinasOperativas: stats.maquinasOperativas,
            totalMaquinas: stats.totalMaquinas,
            ordenesActivas: stats.ordenesActivas,
            eficienciaPromedio: 78 // Mocked for now as it requires complex calculation
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getMaquinas,
    getOrdenesProduccion,
    getProduccionStats
};
