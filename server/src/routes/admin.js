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

// Set cover image for provider
router.put('/providers/:id/cover', authMiddleware, adminOnly, async (req, res) => {
  const { coverImage } = req.body;
  try {
    await pool.query('UPDATE ProviderProfiles SET CoverImage = $1 WHERE Id = $2', [coverImage || null, req.params.id]);
    res.json({ message: 'Cover updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
      ImageCount: parseInt(p.imagecount), CoverImage: p.coverimage || null
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

// Upload image for provider (file or URL)
router.post('/providers/:id/images', authMiddleware, adminOnly, upload.single('image'), async (req, res) => {
  try {
    let filePath;
    if (req.file) {
      filePath = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    } else if (req.body.url) {
      filePath = req.body.url;
    } else {
      return res.status(400).json({ message: 'No image provided' });
    }
    await pool.query('INSERT INTO PortfolioMedia (ProviderId, FilePath) VALUES ($1, $2)', [req.params.id, filePath]);
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

// Get categories
router.get('/categories', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY sortorder, id');
    res.json(result.rows.map(r => ({ Id: r.id, Name: r.name, Icon: r.icon, SortOrder: r.sortorder, BannerUrl: r.banner_url })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add category
router.post('/categories', authMiddleware, adminOnly, async (req, res) => {
  const { name, icon } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categories (name, icon) VALUES ($1, $2) RETURNING *',
      [name, icon || '🏷️']
    );
    const r = result.rows[0];
    res.status(201).json({ Id: r.id, Name: r.name, Icon: r.icon });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'קטגוריה כבר קיימת' });
    res.status(500).json({ message: err.message });
  }
});

// Delete category
router.delete('/categories/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update category
router.put('/categories/:id', authMiddleware, adminOnly, async (req, res) => {
  const { name, icon, bannerUrl } = req.body;
  try {
    await pool.query('UPDATE categories SET name=$1, icon=$2, banner_url=$3 WHERE id=$4', [name, icon, bannerUrl || null, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
