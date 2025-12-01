// Simple DB connection test
const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER || 'node_app',
    password: process.env.DB_PASSWORD || 'NodeAppPass123',
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'flow360',
    port: parseInt(process.env.DB_PORT || '1433'),
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

console.log('🔌 Intentando conectar a SQL Server...');
console.log('Configuracion:', {
    server: config.server,
    database: config.database,
    user: config.user,
    port: config.port
});

sql.connect(config)
    .then(pool => {
        console.log('✅ Conexion exitosa!');
        return pool.request().query('SELECT id, nombre, email FROM usuarios');
    })
    .then(result => {
        console.log(`\n📊 Usuarios encontrados: ${result.recordset.length}`);
        result.recordset.forEach(user => {
            console.log(`  - ${user.email} (${user.nombre})`);
        });
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error:', err.message);
        console.error('\n💡 Posibles causas:');
        console.error('   1. SQL Server no está ejecutándose');
        console.error('   2. La base de datos "flow360" no existe');
        console.error('   3. Las credenciales son incorrectas');
        console.error('   4. El puerto está bloqueado');
        process.exit(1);
    });
