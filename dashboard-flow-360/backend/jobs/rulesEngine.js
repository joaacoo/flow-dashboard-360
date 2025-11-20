const { poolPromise, sql } = require('../config/db');

const execute = async () => {
  try {
    console.log('Evaluating rules...');
    const pool = await poolPromise;
    const rules = await pool.request().query('SELECT * FROM reglas WHERE activo = 1');

    for (const rule of rules.recordset) {
      // Simplified rule evaluation logic
      // In a real engine, 'condicion' would be parsed. 
      // Here we assume 'condicion' is a JSON string like {"metric": "stock", "operator": "<", "value": 10, "producto_id": 1}

      // Example: Check if stock is low
      // This is a placeholder for the actual dynamic evaluation logic
      let triggered = false;
      let details = "";

      // Mock evaluation for demonstration
      if (rule.nombre.includes('Stock')) {
        // Check stock logic
        // const stock = await db.query(...)
        // if (stock < min) triggered = true
      }

      if (triggered) {
        console.log(`Rule ${rule.nombre} triggered! Action: ${rule.accion}`);

        // Log result
        await pool.request()
          .input('regla_id', sql.Int, rule.id)
          .input('resultado', sql.NVarChar, 'TRIGGERED')
          .query('INSERT INTO log_reglas (regla_id, resultado) VALUES (@regla_id, @resultado)');

        // Execute Action (Email, Webhook, etc.)
        if (rule.accion === 'EMAIL') {
          // Send email logic
        } else if (rule.accion === 'NOTIFICATION') {
          await pool.request()
            .input('tipo', sql.VarChar, 'INTERNAL')
            .input('mensaje', sql.NVarChar, `Regla ${rule.nombre} activada`)
            .input('destino', sql.VarChar, 'admin')
            .query('INSERT INTO notificaciones (tipo, mensaje, destino) VALUES (@tipo, @mensaje, @destino)');
        }
      }
    }
  } catch (error) {
    console.error('Error in rules engine:', error);
  }
};

module.exports = { execute };
