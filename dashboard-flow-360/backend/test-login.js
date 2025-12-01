// Script para verificar usuarios y probar el login
const poolPromise = require('./config/db');
const sql = require('mssql');
const bcrypt = require('bcryptjs');

async function testLogin() {
    console.log('\n🔍 VERIFICANDO USUARIOS EN LA BASE DE DATOS...\n');

    try {
        const pool = await poolPromise;

        // Listar todos los usuarios
        const result = await pool.request()
            .query('SELECT id, nombre, email, password FROM usuarios');

        console.log(`📊 Total de usuarios: ${result.recordset.length}\n`);

        if (result.recordset.length === 0) {
            console.log('❌ No hay usuarios en la base de datos!');
            console.log('💡 Necesitas crear un usuario primero.\n');
            return;
        }

        // Mostrar usuarios (sin password completo)
        result.recordset.forEach((user, index) => {
            console.log(`Usuario ${index + 1}:`);
            console.log(`  ID: ${user.id}`);
            console.log(`  Nombre: ${user.nombre}`);
            console.log(`  Email: ${user.email}`);
            console.log(`  Password Hash: ${user.password.substring(0, 20)}...`);
            console.log('');
        });

        // Test de password para admin
        const adminUser = result.recordset.find(u => u.email === 'admin@flow360.com');

        if (adminUser) {
            console.log('🔐 PROBANDO CONTRASEÑAS COMUNES PARA admin@flow360.com:\n');

            const commonPasswords = [
                'admin123',
                'admin',
                'password',
                '123456',
                'Admin123',
                'flow360'
            ];

            for (const pwd of commonPasswords) {
                const isValid = await bcrypt.compare(pwd, adminUser.password);
                console.log(`  "${pwd}": ${isValid ? '✅ CORRECTO' : '❌ incorrecto'}`);
            }

            console.log('\n💡 NOTA: El backend tiene un BYPASS para admin@flow360.com');
            console.log('   que permite login sin verificar contraseña.\n');
        } else {
            console.log('⚠️  No se encontró usuario admin@flow360.com\n');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testLogin();
