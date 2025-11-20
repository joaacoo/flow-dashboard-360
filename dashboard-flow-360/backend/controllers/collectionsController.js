const { poolPromise } = require('../config/db');

const getVencimientos = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT TOP 20 * FROM cuentas_cobrar WHERE pagado = 0 ORDER BY vencimiento ASC");
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getResumen = async (req, res) => {
    try {
        const pool = await poolPromise;
        const totalCobrado = await pool.request().query("SELECT SUM(monto) as total FROM cuentas_cobrar WHERE pagado = 1");
        const totalPendiente = await pool.request().query("SELECT SUM(monto) as total FROM cuentas_cobrar WHERE pagado = 0");

        res.json({
            cobrado: totalCobrado.recordset[0].total || 0,
            pendiente: totalPendiente.recordset[0].total || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registrarPago = async (req, res) => {
    try {
        const { cliente, monto, fecha, metodo, referencia } = req.body;
        const pool = await poolPromise;
        const sql = require('mssql');
        
        // Buscar cliente
        const clienteResult = await pool.request()
            .input('razon_social', sql.VarChar, cliente)
            .query('SELECT id FROM clientes WHERE razon_social = @razon_social');
        
        if (clienteResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        
        const clienteId = clienteResult.recordset[0].id;
        
        // Buscar cuenta por cobrar pendiente
        const cuentaResult = await pool.request()
            .input('cliente_id', sql.Int, clienteId)
            .query('SELECT TOP 1 id, monto FROM cuentas_cobrar WHERE cliente_id = @cliente_id AND pagado = 0 ORDER BY vencimiento ASC');
        
        if (cuentaResult.recordset.length > 0) {
            // Marcar como pagado
            await pool.request()
                .input('id', sql.Int, cuentaResult.recordset[0].id)
                .query('UPDATE cuentas_cobrar SET pagado = 1 WHERE id = @id');
        }
        
        res.json({ success: true, message: 'Pago registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getVencimientos, getResumen, registrarPago };
