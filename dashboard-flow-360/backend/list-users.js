const { poolPromise } = require('./config/db');

async function listUsers() {
    try {
        console.log('Conectando a la base de datos...');
        const pool = await poolPromise;

        console.log('Consultando usuarios...');
        const result = await pool.request().query('SELECT id, nombre, email, created_at FROM usuarios');

        console.log('\n=== USUARIOS EN LA BASE DE DATOS ===\n');

        if (result.recordset.length === 0) {
            console.log('❌ No hay usuarios registrados en la base de datos.');
            console.log('\nPara crear un usuario administrador, ejecuta:');
            console.log('  node create-admin.js');
        } else {
            console.log(`✅ Total de usuarios: ${result.recordset.length}\n`);
            result.recordset.forEach((user, index) => {
                console.log(`${index + 1}. ID: ${user.id}`);
                console.log(`   Nombre: ${user.nombre}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Creado: ${user.created_at}`);
                console.log('');
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error al consultar usuarios:');
        console.error(error.message);

        if (error.message.includes('Invalid object name')) {
            console.log('\n⚠️  La tabla "usuarios" no existe.');
            console.log('Necesitas ejecutar el schema SQL primero:');
            console.log('  sqlcmd -S localhost -U node_app -P NodeAppPass123 -i ../database/schema_mssql.sql');
        }

        process.exit(1);
    }
}

listUsers();
