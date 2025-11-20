const poolPromise = require('../config/db');
const sql = require('mssql');

// Obtener todas las reglas
const getReglas = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                id, nombre, trigger_evento, condicion, accion, activa, descripcion, fecha_creacion
            FROM reglas
            ORDER BY fecha_creacion DESC
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener reglas:', error);
        res.status(500).json({ error: 'Error al obtener reglas' });
    }
};

// Crear nueva regla
const crearRegla = async (req, res) => {
    const { nombre, condicion, accion } = req.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('nombre', sql.NVarChar, nombre)
            .input('condicion', sql.NVarChar, condicion)
            .input('accion', sql.NVarChar, accion)
            .query(`
                INSERT INTO reglas (nombre, condicion, accion, activa)
                VALUES (@nombre, @condicion, @accion, 1)
            `);

        res.json({ message: 'Regla creada exitosamente' });
    } catch (error) {
        console.error('Error al crear regla:', error);
        res.status(500).json({ error: 'Error al crear regla', message: error.message });
    }
};

// Actualizar regla
const actualizarRegla = async (req, res) => {
    const { id } = req.params;
    const { nombre, condicion, accion } = req.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.NVarChar, nombre)
            .input('condicion', sql.NVarChar, condicion)
            .input('accion', sql.NVarChar, accion)
            .query(`
                UPDATE reglas
                SET nombre = @nombre, condicion = @condicion, accion = @accion
                WHERE id = @id
            `);

        res.json({ message: 'Regla actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar regla:', error);
        res.status(500).json({ error: 'Error al actualizar regla' });
    }
};

// Toggle activar/desactivar regla
const toggleRegla = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query(`
                UPDATE reglas
                SET activa = CASE WHEN activa = 1 THEN 0 ELSE 1 END
                WHERE id = @id
            `);

        res.json({ message: 'Estado de regla actualizado' });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
};

// Eliminar regla
const eliminarRegla = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM reglas WHERE id = @id');

        res.json({ message: 'Regla eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar regla:', error);
        res.status(500).json({ error: 'Error al eliminar regla' });
    }
};

module.exports = {
    getReglas,
    crearRegla,
    actualizarRegla,
    toggleRegla,
    eliminarRegla
};
