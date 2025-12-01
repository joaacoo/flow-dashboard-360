const { sql, poolPromise } = require('../config/db');

const getLeads = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM leads ORDER BY fecha_creacion DESC');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createLead = async (req, res) => {
    try {
        const { nombre, contacto, email, telefono, monto, prioridad, estado } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input('nombre', sql.NVarChar, nombre)
            .input('contacto', sql.NVarChar, contacto)
            .input('email', sql.NVarChar, email)
            .input('telefono', sql.NVarChar, telefono)
            .input('monto', sql.Decimal(18, 2), monto)
            .input('prioridad', sql.NVarChar, prioridad)
            .input('estado', sql.NVarChar, estado)
            .query('INSERT INTO leads (nombre, contacto, email, telefono, monto, prioridad, estado) VALUES (@nombre, @contacto, @email, @telefono, @monto, @prioridad, @estado)');
        res.json({ message: 'Lead creado exitosamente' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('estado', sql.NVarChar, estado)
            .query('UPDATE leads SET estado = @estado WHERE id = @id');
        res.json({ message: 'Lead actualizado exitosamente' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                COUNT(*) as totalLeads,
                SUM(monto) as totalMonto,
                (SELECT COUNT(*) FROM leads WHERE estado = 'cerrados') * 100.0 / NULLIF(COUNT(*), 0) as tasaConversion
            FROM leads
        `);
        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getLeads,
    createLead,
    updateLead,
    getDashboardStats
};
