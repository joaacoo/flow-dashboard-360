const sql = require('mssql');
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

const pool = new sql.ConnectionPool(config);

pool.connect()
  .then(() => {
    console.log('✅ Conectado a SQL Server');
    console.log(`   Base de datos: ${process.env.DB_NAME}`);
    console.log(`   Servidor: ${process.env.DB_HOST}`);
    console.log(`   Usuario: ${process.env.DB_USER}`);
  })
  .catch((err) => {
    console.error('❌ Error de conexión a la base de datos:');
    console.error('   Mensaje:', err.message);
    console.error('\n⚠️  Verifica:');
    console.error('   1. SQL Server está corriendo');
    console.error('   2. La base de datos "flow360" existe');
    console.error('   3. El usuario "node_app" tiene permisos');
  });

module.exports = pool;
