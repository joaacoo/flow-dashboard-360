const { poolPromise } = require('../config/db');
const sql = require('mssql');

class TangoService {

    async logSync(type, status, items, message) {
        try {
            const pool = await poolPromise;
            await pool.request()
                .input('sync_type', sql.VarChar, type)
                .input('status', sql.VarChar, status)
                .input('items', sql.Int, items)
                .input('message', sql.VarChar, message)
                .query('INSERT INTO tango_sync_logs (sync_type, status, items_processed, message) VALUES (@sync_type, @status, @items, @message)');
        } catch (error) {
            console.error('Error logging sync:', error);
        }
    }

    async syncProducts() {
        console.log('🔄 Iniciando Sincronización de Productos Tango...');
        let processed = 0;
        try {
            const pool = await poolPromise;

            // 1. Leer de Tango (Simulado en STA11)
            const tangoProducts = await pool.request().query('SELECT * FROM STA11');

            if (tangoProducts.recordset.length === 0) {
                await this.logSync('PRODUCTS', 'WARNING', 0, 'No se encontraron productos en Tango (STA11)');
                return { success: true, message: 'No hay productos nuevos', count: 0 };
            }

            // 2. Upsert en FLOW 360
            for (const prod of tangoProducts.recordset) {
                // Mapeo: COD_ARTICU -> codigo, DESCRIPCIO -> nombre, PRECIO -> precio, STOCK_ACT -> stock
                // Asumimos tabla 'productos' existe. Si no, fallará y lo veremos en logs.

                // Verificar si existe
                const check = await pool.request()
                    .input('codigo', sql.VarChar, prod.COD_ARTICU)
                    .query('SELECT id FROM productos WHERE codigo = @codigo');

                if (check.recordset.length > 0) {
                    // UPDATE
                    await pool.request()
                        .input('codigo', sql.VarChar, prod.COD_ARTICU)
                        .input('nombre', sql.VarChar, prod.DESCRIPCIO)
                        .input('precio', sql.Decimal(18, 2), prod.PRECIO)
                        .input('stock', sql.Int, Math.floor(prod.STOCK_ACT)) // Asumiendo stock entero
                        .query('UPDATE productos SET nombre = @nombre, precio = @precio, stock = @stock WHERE codigo = @codigo');
                } else {
                    // INSERT
                    await pool.request()
                        .input('codigo', sql.VarChar, prod.COD_ARTICU)
                        .input('nombre', sql.VarChar, prod.DESCRIPCIO)
                        .input('precio', sql.Decimal(18, 2), prod.PRECIO)
                        .input('stock', sql.Int, Math.floor(prod.STOCK_ACT))
                        .query('INSERT INTO productos (codigo, nombre, precio, stock) VALUES (@codigo, @nombre, @precio, @stock)');
                }
                processed++;
            }

            await this.logSync('PRODUCTS', 'SUCCESS', processed, 'Sincronización completada correctamente');
            return { success: true, count: processed };

        } catch (error) {
            console.error('Error syncing products:', error);
            await this.logSync('PRODUCTS', 'ERROR', processed, error.message);
            throw error;
        }
    }

    async syncClients() {
        console.log('🔄 Iniciando Sincronización de Clientes Tango...');
        let processed = 0;
        try {
            const pool = await poolPromise;

            // 1. Leer de Tango (Simulado en GVA14)
            const tangoClients = await pool.request().query('SELECT * FROM GVA14');

            for (const client of tangoClients.recordset) {
                // Mapeo: COD_CLIENT -> codigo, RAZON_SOCI -> nombre, EMAIL -> email

                const check = await pool.request()
                    .input('email', sql.VarChar, client.EMAIL)
                    .query('SELECT id FROM clientes WHERE email = @email');

                if (check.recordset.length > 0) {
                    // Update logic if needed
                } else {
                    await pool.request()
                        .input('nombre', sql.VarChar, client.RAZON_SOCI)
                        .input('email', sql.VarChar, client.EMAIL)
                        .input('telefono', sql.VarChar, '000-0000') // Default
                        .query('INSERT INTO clientes (nombre, email, telefono) VALUES (@nombre, @email, @telefono)');
                }
                processed++;
            }

            await this.logSync('CLIENTS', 'SUCCESS', processed, 'Sincronización completada correctamente');
            return { success: true, count: processed };

        } catch (error) {
            console.error('Error syncing clients:', error);
            await this.logSync('CLIENTS', 'ERROR', processed, error.message);
            throw error;
        }
    }

    async getLogs() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT TOP 50 * FROM tango_sync_logs ORDER BY created_at DESC');
        return result.recordset;
    }
}

module.exports = new TangoService();
