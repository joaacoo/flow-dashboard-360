const sql = require('mssql');
const bcrypt = require('bcryptjs');
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

async function fixLogin() {
    console.log('🔄 Iniciando reparación de usuario Admin...');
    console.log(`   Base de datos: ${config.database}`);
    console.log(`   Usuario DB: ${config.user}`);

    try {
        const pool = await new sql.ConnectionPool(config).connect();
        console.log('✅ Conexión a base de datos exitosa.');

        // 1. Generar hash de contraseña nuevo
        const passwordPlain = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passwordPlain, salt);

        console.log('🔑 Generando nueva contraseña encriptada...');

        // 2. Verificar si existe el usuario
        const checkUser = await pool.request()
            .input('email', sql.VarChar, 'admin@flow360.com')
            .query('SELECT * FROM usuarios WHERE email = @email');

        if (checkUser.recordset.length > 0) {
            // ACTUALIZAR
            await pool.request()
                .input('email', sql.VarChar, 'admin@flow360.com')
                .input('password', sql.VarChar, hashedPassword)
                .input('llave', sql.VarChar, 'admin123')
                .query(`
          UPDATE usuarios 
          SET password = @password, llave = @llave, nombre = 'Administrador'
          WHERE email = @email
        `);
            console.log('✅ Usuario Admin ACTUALIZADO correctamente.');
        } else {
            // CREAR
            await pool.request()
                .input('nombre', sql.VarChar, 'Administrador')
                .input('email', sql.VarChar, 'admin@flow360.com')
                .input('password', sql.VarChar, hashedPassword)
                .input('llave', sql.VarChar, 'admin123')
                .query(`
          INSERT INTO usuarios (nombre, email, password, llave)
          VALUES (@nombre, @email, @password, @llave)
        `);
            console.log('✅ Usuario Admin CREADO correctamente.');
        }

        console.log('\n=======================================');
        console.log('🚀 LISTO PARA ENTRAR');
        console.log('=======================================');
        console.log('Usa estas credenciales EXACTAS:');
        console.log('📧 Email:    admin@flow360.com');
        console.log('🔑 Password: admin123');
        console.log('🗝️ Llave:    admin123');
        console.log('=======================================\n');

        process.exit(0);

    } catch (err) {
        console.error('❌ ERROR:', err.message);
        process.exit(1);
    }
}

fixLogin();
