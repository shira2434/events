const express = require('express');
const multer = require('multer');
const { pool } = require('../db/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin only' });
  next();
};

// Get all providers
router.get('/providers', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.Email,
        (SELECT COUNT(*) FROM PortfolioMedia WHERE ProviderId = p.Id) as ImageCount
      FROM ProviderProfiles p
      JOIN Users u ON p.UserId = u.Id
      ORDER BY p.Id DESC
    `);
    res.json(result.rows.map(p => ({
      Id: p.id, UserId: p.userid, BusinessName: p.businessname,
      Category: p.category, Description: p.description,
      WorkArea: p.workarea, PriceFrom: p.pricefrom,
      AverageRating: p.averagerating, Email: p.email,
      ImageCount: parseInt(p.imagecount)
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update provider details
router.put('/providers/:id', authMiddleware, adminOnly, async (req, res) => {
  const { businessName, category, description, workArea, priceFrom } = req.body;
  try {
    await pool.query(
      'UPDATE ProviderProfiles SET BusinessName=$1, Category=$2, Description=$3, WorkArea=$4, PriceFrom=$5 WHERE Id=$6',
      [businessName, category, description, workArea, priceFrom || null, req.params.id]
    );
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete provider
router.delete('/providers/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM ProviderProfiles WHERE Id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get provider images
router.get('/providers/:id/images', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT Id, FilePath, UploadedAt FROM PortfolioMedia WHERE ProviderId=$1 ORDER BY UploadedAt DESC',
      [req.params.id]
    );
    res.json(result.rows.map(r => ({ Id: r.id, FilePath: r.filepath, UploadedAt: r.uploadedat })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload image for provider
router.post('/providers/:id/images', authMiddleware, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    await pool.query('INSERT INTO PortfolioMedia (ProviderId, FilePath) VALUES ($1, $2)', [req.params.id, dataUrl]);
    res.status(201).json({ message: 'Uploaded' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete image
router.delete('/images/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM PortfolioMedia WHERE Id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await pool.query('SELECT Id, Email, Role, CreatedAt FROM Users ORDER BY Id DESC');
    res.json(result.rows.map(u => ({ Id: u.id, Email: u.email, Role: u.role, CreatedAt: u.createdat })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete('/users/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM Users WHERE Id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stats
router.get('/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [users, providers, messages, reviews] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM Users'),
      pool.query('SELECT COUNT(*) FROM ProviderProfiles'),
      pool.query('SELECT COUNT(*) FROM ChatMessages'),
      pool.query('SELECT COUNT(*) FROM Reviews'),
    ]);
    res.json({
      users: parseInt(users.rows[0].count),
      providers: parseInt(providers.rows[0].count),
      messages: parseInt(messages.rows[0].count),
      reviews: parseInt(reviews.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
