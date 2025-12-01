const poolPromise = require('../config/db');
const sql = require('mssql');

// Función auxiliar para crear notificaciones
const createNotification = async (pool, tipo, mensaje) => {
  try {
    await pool.request()
      .input('tipo', sql.VarChar, tipo)
      .input('mensaje', sql.NVarChar, mensaje)
      .input('destino', sql.VarChar, 'sistema')
      .input('leido', sql.Bit, 0)
      .query('INSERT INTO notificaciones (tipo, mensaje, destino, leido) VALUES (@tipo, @mensaje, @destino, @leido)');

    console.log(`✅ Notificación creada: ${mensaje}`);
  } catch (error) {
    console.error('Error al crear notificación:', error.message);
  }
};

const execute = async () => {
  try {
    console.log('🔍 Evaluando reglas de negocio...');
    const pool = await poolPromise;

    // Verificar si la tabla existe antes de consultar
    try {
      const rules = await pool.request().query('SELECT * FROM reglas WHERE activa = 1');

      if (rules.recordset.length === 0) {
        console.log('No hay reglas activas para evaluar.');
        return;
      }

      console.log(`📋 Evaluando ${rules.recordset.length} regla(s) activa(s)...`);

      for (const rule of rules.recordset) {
        let triggered = false;
        let notificationMessage = '';

        // Evaluar según el tipo de regla
        switch (rule.tipo) {
          case 'stock':
            // Verificar stock bajo
            const stockResult = await pool.request()
              .query(`
                SELECT COUNT(*) as count 
                FROM stock 
                WHERE cantidad < stock_minimo
              `);

            if (stockResult.recordset[0].count > 0) {
              triggered = true;
              notificationMessage = `⚠️ ${stockResult.recordset[0].count} producto(s) con stock bajo del mínimo`;
            }
            break;

          case 'ventas':
            // Verificar ventas del día
            const ventasResult = await pool.request()
              .query(`
                SELECT COUNT(*) as count, SUM(total) as total
                FROM ventas 
                WHERE CAST(fecha AS DATE) = CAST(GETDATE() AS DATE)
              `);

            const ventasHoy = ventasResult.recordset[0];
            if (ventasHoy.count > 50) {
              triggered = true;
              notificationMessage = `🎉 ¡Día exitoso! ${ventasHoy.count} ventas realizadas por $${ventasHoy.total?.toFixed(2) || 0}`;
            }
            break;

          case 'cobranzas':
            // Verificar cobranzas vencidas
            const cobranzasResult = await pool.request()
              .query(`
                SELECT COUNT(*) as count 
                FROM cobranzas 
                WHERE estado = 'pendiente' 
                AND fecha_vencimiento < GETDATE()
              `);

            if (cobranzasResult.recordset[0].count > 0) {
              triggered = true;
              notificationMessage = `💰 ${cobranzasResult.recordset[0].count} cobranza(s) vencida(s) pendiente(s)`;
            }
            break;

          case 'produccion':
            // Verificar órdenes de producción atrasadas
            const produccionResult = await pool.request()
              .query(`
                SELECT COUNT(*) as count 
                FROM produccion 
                WHERE estado = 'en_proceso' 
                AND fecha_entrega < GETDATE()
              `);

            if (produccionResult.recordset[0].count > 0) {
              triggered = true;
              notificationMessage = `🏭 ${produccionResult.recordset[0].count} orden(es) de producción atrasada(s)`;
            }
            break;

          case 'logistica':
            // Verificar entregas pendientes
            const logisticaResult = await pool.request()
              .query(`
                SELECT COUNT(*) as count 
                FROM logistica 
                WHERE estado = 'pendiente'
              `);

            if (logisticaResult.recordset[0].count > 10) {
              triggered = true;
              notificationMessage = `🚚 ${logisticaResult.recordset[0].count} entregas pendientes de asignar`;
            }
            break;

          default:
            console.log(`Tipo de regla no reconocido: ${rule.tipo}`);
        }

        // Si la regla se activó, ejecutar acción
        if (triggered) {
          console.log(`🔔 Regla activada: ${rule.nombre}`);

          // Crear notificación
          await createNotification(
            pool,
            rule.tipo === 'ventas' ? 'exito' : 'alerta',
            notificationMessage || rule.nombre
          );

          // Registrar en log de reglas (si existe la tabla)
          try {
            await pool.request()
              .input('regla_id', sql.Int, rule.id)
              .input('resultado', sql.NVarChar, notificationMessage)
              .query(`
                INSERT INTO log_reglas (regla_id, resultado, fecha_ejecucion) 
                VALUES (@regla_id, @resultado, GETDATE())
              `);
          } catch (logError) {
            console.log('Tabla log_reglas no disponible, saltando registro.');
          }
        }
      }

      console.log('✅ Evaluación de reglas completada.');

    } catch (err) {
      if (err.message.includes('Invalid object name')) {
        console.log('⚠️ Tabla reglas no encontrada, saltando evaluación.');
      } else {
        throw err;
      }
    }

  } catch (error) {
    console.error('❌ Error en motor de reglas:', error.message);
  }
};

module.exports = { execute };
