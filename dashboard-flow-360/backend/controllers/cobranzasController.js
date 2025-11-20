const poolPromise = require('../config/db');
const sql = require('mssql');

// Registrar pago
const registrarPago = async (req, res) => {
    const { cliente, monto, fecha, metodo, referencia } = req.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('cliente', sql.NVarChar, cliente)
            .input('monto', sql.Decimal(18, 2), monto)
            .input('fecha_pago', sql.Date, fecha)
            .input('metodo_pago', sql.NVarChar, metodo)
            .input('referencia', sql.NVarChar, referencia)
            .query(`
                INSERT INTO pagos (cliente, monto, fecha_pago, metodo_pago, referencia)
                VALUES (@cliente, @monto, @fecha_pago, @metodo_pago, @referencia)
            `);

        res.json({ message: 'Pago registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar pago:', error);
        res.status(500).json({ error: 'Error al registrar pago', message: error.message });
    }
};

// Obtener aging report
const getAgingReport = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                CASE 
                    WHEN dias_atraso = 0 THEN 'Al día'
                    WHEN dias_atraso <= 30 THEN '30 días'
                    WHEN dias_atraso <= 60 THEN '60 días'
                    ELSE '90+ días'
                END as categoria,
                SUM(monto) as monto
            FROM cuentas_cobrar
            WHERE estado = 'Pendiente'
            GROUP BY 
                CASE 
                    WHEN dias_atraso = 0 THEN 'Al día'
                    WHEN dias_atraso <= 30 THEN '30 días'
                    WHEN dias_atraso <= 60 THEN '60 días'
                    ELSE '90+ días'
                END
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener aging report:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
};

// Obtener top deudores
const getTopDeudores = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT TOP 5 
                id, cliente, monto, dias_atraso, contacto
            FROM cuentas_cobrar
            WHERE estado = 'Pendiente'
            ORDER BY monto DESC
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener deudores:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
};

module.exports = {
    registrarPago,
    getAgingReport,
    getTopDeudores
};
