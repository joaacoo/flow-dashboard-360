const sql = require('mssql');
require('dotenv').config();

// Configuración de la base de datos SQL Server
const config = {
    user: process.env.DB_USER || 'node_app',
    password: process.env.DB_PASSWORD || 'NodeAppPass123',
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'flow360',
    port: parseInt(process.env.DB_PORT || '1433'),
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectionTimeout: 10000 // 10 segundos timeout
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Crear el pool de conexiones
const pool = new sql.ConnectionPool(config);

// Conectar y exportar la promesa del pool conectado
const poolPromise = pool.connect()
    .then((pool) => {
        console.log('✅ Conectado a SQL Server correctamente');
        return pool;
    })
    .catch((err) => {
        console.error('❌ Error de conexión a la base de datos:', err.message);
        console.error('Configuración:', {
            server: config.server,
            database: config.database,
            user: config.user,
            port: config.port
        });
        // No cerrar el proceso, permitir que la app intente reconectar
        return null;
    });

module.exports = poolPromise;
