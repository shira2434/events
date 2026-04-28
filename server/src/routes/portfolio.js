const express = require('express');
const multer = require('multer');
const path = require('path');
const { pool, poolConnect, sql } = require('../db/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', authMiddleware, upload.array('files', 10), async (req, res) => {
  if (req.user.role !== 'Provider') return res.status(403).json({ message: 'Forbidden' });
  try {
    await poolConnect;
    const providerResult = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .query('SELECT Id FROM ProviderProfiles WHERE UserId = @userId');

    const provider = providerResult.recordset[0];
    if (!provider) return res.status(404).json({ message: 'Provider profile not found' });

    for (const file of req.files) {
      await pool.request()
        .input('providerId', sql.Int, provider.Id)
        .input('filePath', sql.NVarChar, `/uploads/${file.filename}`)
        .query('INSERT INTO PortfolioMedia (ProviderId, FilePath) VALUES (@providerId, @filePath)');
    }

    res.status(201).json({ message: `${req.files.length} file(s) uploaded` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
