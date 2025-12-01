const poolPromise = require('../config/db');
const sql = require('mssql');

const execute = async () => {
  try {
    console.log('Evaluating rules...');
    const pool = await poolPromise;

    // Verificar si la tabla existe antes de consultar para evitar errores
    try {
      const rules = await pool.request().query('SELECT * FROM reglas WHERE activa = 1');

      for (const rule of rules.recordset) {
        // Lógica simplificada de evaluación
        // En un motor real, se parsearía la condición.
        let triggered = false;

        // Mock evaluation
        if (rule.nombre.includes('Stock')) {
          // Lógica de stock
        }

        if (triggered) {
          console.log(`Rule ${rule.nombre} triggered! Action: ${rule.accion}`);

          // Log result (verificar si existe la tabla log_reglas)
          // await pool.request()...
        }
      }
    } catch (err) {
      console.log('Tabla reglas no encontrada o error en query, saltando job de reglas.');
    }

  } catch (error) {
    console.error('Error in rules engine:', error);
  }
};

module.exports = { execute };
