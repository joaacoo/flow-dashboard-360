const sql = require('mssql');
const fs = require('fs');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

async function test() {
    let output = '';

    try {
        output += '=== PROBANDO CONEXIÓN A SQL SERVER ===\n\n';
        output += `Servidor: ${config.server}\n`;
        output += `Base de datos: ${config.database}\n`;
        output += `Usuario: ${config.user}\n`;
        output += `Puerto: ${config.port}\n\n`;

        output += 'Conectando...\n';
        const pool = await sql.connect(config);
        output += '✅ Conexión exitosa!\n\n';

        // Test query
        const result = await pool.request().query('SELECT 1 as val');
        output += `Test query: ${JSON.stringify(result.recordset[0])}\n\n`;

        // Check tables
        const tables = await pool.request().query("SELECT name FROM sys.tables ORDER BY name");
        output += `Tablas encontradas (${tables.recordset.length}):\n`;
        tables.recordset.forEach(t => {
            output += `  - ${t.name}\n`;
        });

        // Check users
        output += '\n=== USUARIOS ===\n';
        const users = await pool.request().query('SELECT id, nombre, email, created_at FROM usuarios');
        if (users.recordset.length === 0) {
            output += '❌ No hay usuarios en la base de datos.\n';
        } else {
            output += `✅ ${users.recordset.length} usuario(s) encontrado(s):\n\n`;
            users.recordset.forEach((user, i) => {
                output += `${i + 1}. ${user.nombre} (${user.email}) - ID: ${user.id}\n`;
            });
        }

        await pool.close();

    } catch (err) {
        output += '\n❌ ERROR:\n';
        output += err.message + '\n';
        output += '\nStack:\n' + err.stack;
    }

    fs.writeFileSync('db-test-result.txt', output);
    console.log(output);
}

test();
