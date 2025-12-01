const poolPromise = require('../config/db');
const sql = require('mssql');

// Obtener inventario completo
const getInventario = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                id, sku, nombre, categoria, deposito, 
                cantidad, minimo, precio, 
                fecha_creacion, fecha_actualizacion
            FROM productos
            ORDER BY nombre
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener inventario:', error);
        res.status(500).json({ error: 'Error al obtener inventario' });
    }
};

// Crear nuevo producto
const crearProducto = async (req, res) => {
    const { sku, nombre, categoria, deposito, stockInicial, puntoPedido, precio } = req.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('sku', sql.NVarChar, sku)
            .input('nombre', sql.NVarChar, nombre)
            .input('categoria', sql.NVarChar, categoria)
            .input('deposito', sql.NVarChar, deposito || 'Central')
            .input('cantidad', sql.Int, stockInicial || 0)
            .input('minimo', sql.Int, puntoPedido || 0)
            .input('precio', sql.Decimal(18, 2), precio || 0)
            .query(`
                INSERT INTO productos (sku, nombre, categoria, deposito, cantidad, minimo, precio)
                VALUES (@sku, @nombre, @categoria, @deposito, @cantidad, @minimo, @precio)
            `);

        res.json({ message: 'Producto creado exitosamente' });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error al crear producto', message: error.message });
    }
};

// Actualizar producto
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, categoria, deposito, cantidad, minimo, precio } = req.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.NVarChar, nombre)
            .input('categoria', sql.NVarChar, categoria)
            .input('deposito', sql.NVarChar, deposito)
            .input('cantidad', sql.Int, cantidad)
            .input('minimo', sql.Int, minimo)
            .input('precio', sql.Decimal(18, 2), precio)
            .query(`
                UPDATE productos
                SET nombre = @nombre, categoria = @categoria, deposito = @deposito,
                    cantidad = @cantidad, minimo = @minimo, precio = @precio,
                    fecha_actualizacion = GETDATE()
                WHERE id = @id
            `);

        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM productos WHERE id = @id');

        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};

// Obtener resumen de stock
const getStockSummary = async (req, res) => {
    try {
        const pool = await poolPromise;
        // Mock summary for now
        res.json({
            total_items: 0,
            low_stock_items: 0,
            total_value: 0
        });
    } catch (error) {
        console.error('Error en resumen de stock:', error);
        res.status(500).json({ error: 'Error al obtener resumen de stock' });
    }
};

module.exports = {
    getInventario,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    getStockSummary
};
