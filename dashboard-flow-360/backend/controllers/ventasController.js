const poolPromise = require('../config/db');
const sql = require('mssql');

// Obtener todos los pedidos
const getPedidos = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                id, numero_pedido, cliente, monto, estado,
                CONVERT(VARCHAR, fecha_pedido, 103) as fecha,
                fecha_creacion
            FROM pedidos
            ORDER BY fecha_creacion DESC
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
};

// Crear nuevo pedido
const crearPedido = async (req, res) => {
    const { cliente, productos, fecha, estado } = req.body;

    try {
        const pool = await poolPromise;
        // Calcular total
        const total = productos.reduce((sum, p) => sum + (p.cantidad * p.precio), 0);

        // Generar número de pedido
        const countResult = await pool.request().query('SELECT COUNT(*) as total FROM pedidos');
        const numeroPedido = `#VTA-${String(countResult.recordset[0].total + 1).padStart(3, '0')}`;

        // Insertar pedido
        await pool.request()
            .input('numero_pedido', sql.NVarChar, numeroPedido)
            .input('cliente', sql.NVarChar, cliente)
            .input('monto', sql.Decimal(18, 2), total)
            .input('estado', sql.NVarChar, estado || 'Pendiente')
            .input('fecha_pedido', sql.Date, fecha || new Date())
            .query(`
                INSERT INTO pedidos (numero_pedido, cliente, monto, estado, fecha_pedido)
                VALUES (@numero_pedido, @cliente, @monto, @estado, @fecha_pedido)
            `);

        res.json({ message: 'Pedido creado exitosamente', numeroPedido });
    } catch (error) {
        console.error('Error al crear pedido:', error);
        res.status(500).json({ error: 'Error al crear pedido', message: error.message });
    }
};

module.exports = {
    getPedidos,
    crearPedido
};
