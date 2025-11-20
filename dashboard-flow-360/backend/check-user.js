            const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER || 'node_app',
    password: process.env.DB_PASSWORD || 'NodeAppPass123',
    server: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'flow360',
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

async function checkUser() {
    try {
        console.log('🔍 Conectando a la base de datos...');
        const pool = await new sql.ConnectionPool(config).connect();

        console.log('🔍 Buscando usuario admin@flow360.com...');
        const result = await pool.request()
            .query("SELECT id, nombre, email, llave, password FROM usuarios WHERE email = 'admin@flow360.com'");

        if (result.recordset.length === 0) {
            console.log('❌ EL USUARIO NO EXISTE EN LA BASE DE DATOS.');
        } else {
            const user = result.recordset[0];
            console.log('✅ USUARIO ENCONTRADO:');
            console.log('   ID:', user.id);
            console.log('   Nombre:', user.nombre);
            console.log('   Email:', user.email);
            console.log('   Llave:', user.llave);
            console.log('   Password Hash:', user.password);
            console.log('   (Longitud del Hash):', user.password.length);
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ ERROR:', err.message);
        process.exit(1);
    }
}

checkUser();
