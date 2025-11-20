const poolPromise = require('../config/db');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { nombre, email, llave, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await poolPromise;

    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('email', sql.VarChar, email)
      .input('llave', sql.VarChar, llave)
      .input('password', sql.VarChar, hashedPassword)
      .query('INSERT INTO usuarios (nombre, email, llave, password) OUTPUT Inserted.id, Inserted.nombre, Inserted.email VALUES (@nombre, @email, @llave, @password)');

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('\n👉 INTENTO DE LOGIN RECIBIDO');
  console.log('   Email:', email);
  console.log('   Password proporcionada:', password ? '******' : '(vacía)');

  try {
    console.log('   1. Conectando a la base de datos...');
    const pool = await poolPromise;
    console.log('   ✅ Conexión obtenida.');

    console.log('   2. Buscando usuario en DB...');
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM usuarios WHERE email = @email');

    if (result.recordset.length === 0) {
      console.log('   ❌ USUARIO NO ENCONTRADO en la base de datos.');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = result.recordset[0];
    console.log('   ✅ Usuario encontrado:', user.nombre);
    console.log('   🔑 Hash en DB:', user.password.substring(0, 20) + '...');

    console.log('   3. Verificando contraseña...');
    const isValid = await bcrypt.compare(password, user.password);
    console.log('   🤔 Resultado comparación:', isValid);

    if (!isValid) {
      console.log('   ❌ CONTRASEÑA INCORRECTA.');
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    console.log('   ✅ LOGIN EXITOSO. Generando token...');
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret_key_flow360', {
      expiresIn: '24h',
    });

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    });
  } catch (error) {
    console.error('   ❌ ERROR CRÍTICO EN LOGIN:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

const me = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.userId)
      .query('SELECT id, nombre, email FROM usuarios WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error en me:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const listUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT id, nombre, email, created_at FROM usuarios ORDER BY id');

    res.json({
      total: result.recordset.length,
      usuarios: result.recordset
    });
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({
      message: 'Error al listar usuarios',
      error: error.message
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT id, nombre, email FROM usuarios WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'No existe un usuario con ese correo electrónico' });
    }

    // TODO: Generar token y enviar email
    console.log(`Solicitud de recuperación de contraseña para: ${email}`);

    res.json({
      message: 'Se ha enviado un correo de recuperación',
      success: true
    });
  } catch (error) {
    console.error('Error en forgot password:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
};

module.exports = { register, login, me, listUsers, forgotPassword };
