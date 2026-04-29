const express = require('express');
const multer = require('multer');
const { pool } = require('../db/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', authMiddleware, upload.array('files', 10), async (req, res) => {
  if (req.user.role !== 'Provider') return res.status(403).json({ message: 'Forbidden' });
  try {
    const providerResult = await pool.query(
      'SELECT Id FROM ProviderProfiles WHERE UserId = $1', [req.user.id]
    );
    const provider = providerResult.rows[0];
    if (!provider) return res.status(404).json({ message: 'Provider profile not found' });

    for (const file of req.files) {
      // Store as base64 data URL since we have no persistent disk on Railway
      const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      await pool.query(
        'INSERT INTO PortfolioMedia (ProviderId, FilePath) VALUES ($1, $2)',
        [provider.id, dataUrl]
      );
    }
    res.status(201).json({ message: `${req.files.length} file(s) uploaded` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
