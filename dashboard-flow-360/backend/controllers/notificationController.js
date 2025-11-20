const { poolPromise, sql } = require('../config/db');

const testNotification = async (req, res) => {
    const { tipo, mensaje, destino } = req.body;
    try {
        // Simulate sending
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

module.exports = { testNotification };
