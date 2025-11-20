const { poolPromise, sql } = require('../config/db');

const createRule = async (req, res) => {
  const { nombre, condicion, accion } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('condicion', sql.NVarChar, condicion)
      .input('accion', sql.VarChar, accion)
      .query('INSERT INTO reglas (nombre, condicion, accion) OUTPUT Inserted.* VALUES (@nombre, @condicion, @accion)');
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRules = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM reglas ORDER BY id DESC');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRule = async (req, res) => {
  const { id } = req.params;
  const { nombre, condicion, accion, activo } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.VarChar, nombre)
      .input('condicion', sql.NVarChar, condicion)
      .input('accion', sql.VarChar, accion)
      .input('activo', sql.Bit, activo !== undefined ? activo : true)
      .query('UPDATE reglas SET nombre = @nombre, condicion = @condicion, accion = @accion, activo = @activo OUTPUT Inserted.* WHERE id = @id');
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRule = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM reglas WHERE id = @id');
    res.json({ message: 'Rule deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRule, getRules, updateRule, deleteRule };
