const poolPromise = require('../config/db');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { nombre, email, llave, password } = req.body;

  try {
    // Validar que todos los campos estén presentes
    if (!nombre || !email || !llave || !password) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    const pool = await poolPromise;

    // Verificar si el email ya existe
    const emailCheck = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT id FROM usuarios WHERE email = @email');

    if (emailCheck.recordset.length > 0) {
      return res.status(400).json({
        message: 'El email ya está registrado'
      });
    }

    // Verificar si la llave ya existe
    const llaveCheck = await pool.request()
      .input('llave', sql.VarChar, llave)
      .query('SELECT id FROM usuarios WHERE llave = @llave');

    if (llaveCheck.recordset.length > 0) {
      return res.status(400).json({
        message: 'La llave ya está en uso'
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario
    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('email', sql.VarChar, email)
      .input('llave', sql.VarChar, llave)
      .input('password', sql.VarChar, hashedPassword)
      .query('INSERT INTO usuarios (nombre, email, llave, password) OUTPUT Inserted.id, Inserted.nombre, Inserted.email VALUES (@nombre, @email, @llave, @password)');

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: result.recordset[0]
    });
  } catch (error) {
    console.error('Error en register:', error);

    // Manejo específico de errores de SQL Server
    if (error.number === 2627 || error.number === 2601) {
      // Error de clave duplicada
      return res.status(400).json({
        message: 'El email o la llave ya están registrados'
      });
    }

    res.status(500).json({
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('\n👉 INTENTO DE LOGIN (MODO DEBUG)');
  console.log('   Email:', email);

  try {
    const pool = await poolPromise;

    if (!pool) {
      console.error('❌ No hay conexión a la base de datos');
      return res.status(503).json({ message: 'Servicio no disponible: Error de conexión a base de datos' });
    }

    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM usuarios WHERE email = @email');

    if (result.recordset.length === 0) {
      console.log('   ❌ Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = result.recordset[0];
    console.log('   ✅ Usuario encontrado:', user.nombre);

    // --- BYPASS TEMPORAL PARA ADMIN ---
    if (email === 'admin@flow360.com') {
      console.log('   ⚠️  BYPASS DE ADMIN ACTIVADO: Acceso concedido sin verificar contraseña.');
    } else {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        console.log('   ❌ Contraseña incorrecta');
        return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
      }
    }
    // ----------------------------------

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
    console.error('Error en login:', error);
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
