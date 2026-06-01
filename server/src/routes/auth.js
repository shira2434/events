const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, role, fullName } = req.body;
  if (!['Customer', 'Provider'].includes(role))
    return res.status(400).json({ message: 'Invalid role' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO Users (Email, PasswordHash, Role, FullName) VALUES ($1, $2, $3, $4) RETURNING Id, Role, FullName',
      [email, hash, role, fullName || null]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, role: user.role, fullName: user.fullname });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Email already exists' });
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM Users WHERE Email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.passwordhash)))
      return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, role: user.role, fullName: user.fullname || null, email: user.email });
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
    const result = await pool.query('SELECT PasswordHash FROM Users WHERE Id = $1', [id]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordhash)))
      return res.status(401).json({ message: 'הסיסמה הנוכחית שגויה' });
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE Users SET PasswordHash = $1 WHERE Id = $2', [hash, id]);
    res.json({ message: 'ok' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
