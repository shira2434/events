const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, poolConnect, sql } = require('../db/db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  if (!['Customer', 'Provider'].includes(role))
    return res.status(400).json({ message: 'Invalid role' });

  try {
    await poolConnect;
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .input('hash', sql.NVarChar, hash)
      .input('role', sql.NVarChar, role)
      .query('INSERT INTO Users (Email, PasswordHash, Role) OUTPUT INSERTED.Id, INSERTED.Role VALUES (@email, @hash, @role)');

    const user = result.recordset[0];
    const token = jwt.sign({ id: user.Id, role: user.Role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, role: user.Role });
  } catch (err) {
    if (err.number === 2627) return res.status(409).json({ message: 'Email already exists' });
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM Users WHERE Email = @email');

    const user = result.recordset[0];
    if (!user || !(await bcrypt.compare(password, user.PasswordHash)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.Id, role: user.Role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, role: user.Role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/password', async (req, res) => {
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const { id } = jwt.verify(auth, process.env.JWT_SECRET);
    const { currentPassword, newPassword } = req.body;
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT PasswordHash FROM Users WHERE Id = @id');
    const user = result.recordset[0];
    if (!user || !(await bcrypt.compare(currentPassword, user.PasswordHash)))
      return res.status(401).json({ message: 'הסיסמה הנוכחית שגויה' });
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.request()
      .input('id', sql.Int, id)
      .input('hash', sql.NVarChar, hash)
      .query('UPDATE Users SET PasswordHash = @hash WHERE Id = @id');
    res.json({ message: 'ok' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
