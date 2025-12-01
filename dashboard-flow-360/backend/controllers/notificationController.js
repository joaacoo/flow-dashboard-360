const poolPromise = require('../config/db');
const sql = require('mssql');

// Obtener todas las notificaciones del usuario
const getNotifications = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
        SELECT 
          id, 
          tipo, 
          mensaje, 
          destino, 
          leido, 
          created_at,
          DATEDIFF(MINUTE, created_at, GETDATE()) as minutos_transcurridos
        FROM notificaciones 
        ORDER BY created_at DESC
      `);

        res.json({
            total: result.recordset.length,
            noLeidas: result.recordset.filter(n => !n.leido).length,
            notificaciones: result.recordset
        });
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener solo notificaciones no leídas
const getUnreadNotifications = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
        SELECT 
          id, 
          tipo, 
          mensaje, 
          destino, 
          created_at,
          DATEDIFF(MINUTE, created_at, GETDATE()) as minutos_transcurridos
        FROM notificaciones 
        WHERE leido = 0
        ORDER BY created_at DESC
      `);

        res.json({
            total: result.recordset.length,
            notificaciones: result.recordset
        });
    } catch (error) {
        console.error('Error al obtener notificaciones no leídas:', error);
        res.status(500).json({ message: error.message });
    }
};

// Marcar notificación como leída
const markAsRead = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('UPDATE notificaciones SET leido = 1 WHERE id = @id');

        res.json({ message: 'Notificación marcada como leída' });
    } catch (error) {
        console.error('Error al marcar notificación como leída:', error);
        res.status(500).json({ message: error.message });
    }
};

// Marcar todas como leídas
const markAllAsRead = async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .query('UPDATE notificaciones SET leido = 1 WHERE leido = 0');

        res.json({ message: 'Todas las notificaciones marcadas como leídas' });
    } catch (error) {
        console.error('Error al marcar todas como leídas:', error);
        res.status(500).json({ message: error.message });
    }
};

// Crear notificación (usado por las reglas de negocio)
const createNotification = async (req, res) => {
    const { tipo, mensaje, destino } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('tipo', sql.VarChar, tipo)
            .input('mensaje', sql.NVarChar, mensaje)
            .input('destino', sql.VarChar, destino || 'sistema')
            .input('leido', sql.Bit, 0)
            .query(`
        INSERT INTO notificaciones (tipo, mensaje, destino, leido) 
        OUTPUT Inserted.id, Inserted.tipo, Inserted.mensaje, Inserted.created_at
        VALUES (@tipo, @mensaje, @destino, @leido)
      `);

        res.status(201).json({
            message: 'Notificación creada',
            notificacion: result.recordset[0]
        });
    } catch (error) {
        console.error('Error al crear notificación:', error);
        res.status(500).json({ message: error.message });
    }
};

// Test de notificación
const testNotification = async (req, res) => {
    const { tipo, mensaje, destino } = req.body;

    try {
        console.log(`Sending ${tipo} to ${destino}: ${mensaje}`);

        const pool = await poolPromise;
        await pool.request()
            .input('tipo', sql.VarChar, tipo)
            .input('mensaje', sql.NVarChar, mensaje)
            .input('destino', sql.VarChar, destino)
            .input('leido', sql.Bit, 0)
            .query('INSERT INTO notificaciones (tipo, mensaje, destino, leido) VALUES (@tipo, @mensaje, @destino, @leido)');

        res.json({ message: 'Notification sent and saved' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNotifications,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    testNotification
};
