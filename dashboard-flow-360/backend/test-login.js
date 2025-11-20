const bcrypt = require('bcryptjs');
const { poolPromise, sql } = require('./config/db');

async function testLogin() {
    try {
        console.log('🔍 Verificando usuario admin...\n');

        const pool = await poolPromise;

        // Buscar usuario admin
        const result = await pool.request()
            .input('email', sql.VarChar, 'admin@flow360.com')
            .query('SELECT * FROM usuarios WHERE email = @email');

        if (result.recordset.length === 0) {
            console.log('❌ Usuario admin NO encontrado');
            console.log('📝 Creando usuario admin...\n');

            // Crear usuario admin
            const hashedPassword = await bcrypt.hash('admin123', 10);

            await pool.request()
                .input('nombre', sql.VarChar, 'Administrador')
                .input('email', sql.VarChar, 'admin@flow360.com')
                .input('llave', sql.VarChar, 'admin123')
                .input('password', sql.VarChar, hashedPassword)
                .query('INSERT INTO usuarios (nombre, email, llave, password) VALUES (@nombre, @email, @llave, @password)');

            console.log('✅ Usuario admin creado exitosamente');
        } else {
            const user = result.recordset[0];
            console.log('✅ Usuario encontrado:');
            console.log('   ID:', user.id);
            console.log('   Nombre:', user.nombre);
            console.log('   Email:', user.email);
            console.log('   Llave:', user.llave);
            console.log('   Password Hash:', user.password.substring(0, 30) + '...');

            // Probar la contraseña
            console.log('\n🔐 Probando contraseña "admin123"...');
            const isValid = await bcrypt.compare('admin123', user.password);

            if (isValid) {
                console.log('✅ ¡Contraseña CORRECTA!');
            } else {
                console.log('❌ Contraseña INCORRECTA');
                console.log('📝 Actualizando contraseña...\n');

                const hashedPassword = await bcrypt.hash('admin123', 10);

                await pool.request()
                    .input('email', sql.VarChar, 'admin@flow360.com')
                    .input('password', sql.VarChar, hashedPassword)
                    .input('llave', sql.VarChar, 'admin123')
                    .query('UPDATE usuarios SET password = @password, llave = @llave WHERE email = @email');

                console.log('✅ Contraseña actualizada correctamente');
            }
        }

        console.log('\n============================================');
        console.log('✅ VERIFICACIÓN COMPLETADA');
        console.log('============================================');
        console.log('Credenciales de acceso:');
        console.log('  Email: admin@flow360.com');
        console.log('  Password: admin123');
        console.log('============================================\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testLogin();
