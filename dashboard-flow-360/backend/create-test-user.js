// create-test-user.js - Script para crear un usuario de prueba
const poolPromise = require('./config/db');
const sql = require('mssql');
const bcrypt = require('bcryptjs');

async function createTestUser() {
    console.log('\n🔧 CREANDO USUARIO DE PRUEBA...\n');

    try {
        const pool = await poolPromise;

        if (!pool) {
            console.log('❌ No se pudo conectar a la base de datos');
            console.log('💡 Verifica que SQL Server esté ejecutándose');
            process.exit(1);
        }

        console.log('✅ Conectado a la base de datos\n');

        // Primero, verificar usuarios existentes
        const existing = await pool.request()
            .query('SELECT id, nombre, email FROM usuarios');

        console.log(`📊 Usuarios existentes: ${existing.recordset.length}`);
        existing.recordset.forEach(user => {
            console.log(`  - ${user.email} (${user.nombre})`);
        });
        console.log('');

        // Crear usuario admin si no existe
        const adminExists = existing.recordset.some(u => u.email === 'admin@flow360.com');

        if (!adminExists) {
            console.log('⚙️  Creando usuario admin@flow360.com...');
            const hashedPassword = await bcrypt.hash('admin123', 10);

            await pool.request()
                .input('nombre', sql.VarChar, 'Administrador')
                .input('email', sql.VarChar, 'admin@flow360.com')
                .input('llave', sql.VarChar, 'admin_key')
                .input('password', sql.VarChar, hashedPassword)
                .query('INSERT INTO usuarios (nombre, email, llave, password) VALUES (@nombre, @email, @llave, @password)');

            console.log('✅ Usuario admin@flow360.com creado');
            console.log('   Email: admin@flow360.com');
            console.log('   Password: admin123 (puede ser cualquiera debido al bypass)');
        } else {
            console.log('ℹ️  Usuario admin@flow360.com ya existe');
            console.log('   Nota: Debido al bypass, puedes usar CUALQUIER contraseña');
        }

        // Crear usuario test si no existe
        const testExists = existing.recordset.some(u => u.email === 'test@flow360.com');

        if (!testExists) {
            console.log('\n⚙️  Creando usuario test@flow360.com...');
            const hashedPassword = await bcrypt.hash('test123', 10);

            await pool.request()
                .input('nombre', sql.VarChar, 'Usuario de Prueba')
                .input('email', sql.VarChar, 'test@flow360.com')
                .input('llave', sql.VarChar, 'test_key')
                .input('password', sql.VarChar, hashedPassword)
                .query('INSERT INTO usuarios (nombre, email, llave, password) VALUES (@nombre, @email, @llave, @password)');

            console.log('✅ Usuario test@flow360.com creado');
            console.log('   Email: test@flow360.com');
            console.log('   Password: test123');
        } else {
            console.log('ℹ️  Usuario test@flow360.com ya existe');
        }

        console.log('\n✅ Proceso completado');
        console.log('\n💡 CREDENCIALES PARA LOGIN:');
        console.log('   Admin: admin@flow360.com / cualquier_password');
        console.log('   Test: test@flow360.com / test123\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

createTestUser();
