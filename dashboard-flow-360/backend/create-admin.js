const { poolPromise, sql } = require('./config/db');
const bcrypt = require('bcryptjs');
const fs = require('fs');

async function createAdmin() {
  const logFile = 'create-admin-log.txt';

  try {
    fs.writeFileSync(logFile, '=== CREANDO USUARIO ADMINISTRADOR ===\n\n');
    fs.appendFileSync(logFile, `Fecha: ${new Date().toISOString()}\n\n`);

    fs.appendFileSync(logFile, '1. Conectando a la base de datos...\n');
    const pool = await poolPromise;
    fs.appendFileSync(logFile, '   ✅ Conectado exitosamente\n\n');

    const adminEmail = 'admin@flow360.com';
    const adminPassword = 'admin123';
    const adminNombre = 'Administrador';

    fs.appendFileSync(logFile, `2. Verificando si existe el usuario: ${adminEmail}\n`);
    const check = await pool.request()
      .input('email', sql.VarChar, adminEmail)
      .query('SELECT * FROM usuarios WHERE email = @email');

    fs.appendFileSync(logFile, `   Usuarios encontrados: ${check.recordset.length}\n\n`);

    if (check.recordset.length > 0) {
      fs.appendFileSync(logFile, '⚠️  El usuario administrador YA EXISTE\n');
      fs.appendFileSync(logFile, `   Email: ${adminEmail}\n`);
      fs.appendFileSync(logFile, `   Nombre: ${check.recordset[0].nombre}\n`);
      fs.appendFileSync(logFile, `   ID: ${check.recordset[0].id}\n`);

      console.log('⚠️  El usuario administrador ya existe.');
    } else {
      fs.appendFileSync(logFile, '3. Hasheando contraseña...\n');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      fs.appendFileSync(logFile, '   ✅ Contraseña hasheada\n\n');

      fs.appendFileSync(logFile, '4. Insertando usuario en la base de datos...\n');
      const result = await pool.request()
        .input('nombre', sql.VarChar, adminNombre)
        .input('email', sql.VarChar, adminEmail)
        .input('password', sql.VarChar, hashedPassword)
        .query('INSERT INTO usuarios (nombre, email, password) OUTPUT Inserted.id VALUES (@nombre, @email, @password)');

      fs.appendFileSync(logFile, `   ✅ Usuario creado con ID: ${result.recordset[0].id}\n\n`);
      fs.appendFileSync(logFile, '=== USUARIO CREADO EXITOSAMENTE ===\n\n');
      fs.appendFileSync(logFile, 'Credenciales:\n');
      fs.appendFileSync(logFile, `  Email: ${adminEmail}\n`);
      fs.appendFileSync(logFile, `  Password: ${adminPassword}\n\n`);
      fs.appendFileSync(logFile, '⚠️  IMPORTANTE: Cambia la contraseña después del primer login!\n');

      console.log('✅ Usuario administrador creado exitosamente!');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
    }

    await pool.close();
    fs.appendFileSync(logFile, '\n✅ Proceso completado\n');
    process.exit(0);

  } catch (error) {
    fs.appendFileSync(logFile, '\n❌ ERROR:\n');
    fs.appendFileSync(logFile, `Mensaje: ${error.message}\n`);
    fs.appendFileSync(logFile, `Stack: ${error.stack}\n`);

    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createAdmin();
