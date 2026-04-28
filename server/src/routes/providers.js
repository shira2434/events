const express = require('express');
const { pool, poolConnect, sql } = require('../db/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Update provider settings (Provider only) — must be BEFORE /:id
router.put('/settings', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Provider') return res.status(403).json({ message: 'Forbidden' });
  const { businessName, category, description, workArea, priceFrom } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input('userId', sql.Int, req.user.id)
      .input('businessName', sql.NVarChar, businessName)
      .input('category', sql.NVarChar, category)
      .input('description', sql.NVarChar, description)
      .input('workArea', sql.NVarChar, workArea)
      .input('priceFrom', sql.Int, priceFrom)
      .query(`IF EXISTS (SELECT 1 FROM ProviderProfiles WHERE UserId = @userId)
                UPDATE ProviderProfiles SET BusinessName=@businessName, Category=@category, Description=@description, WorkArea=@workArea, PriceFrom=@priceFrom WHERE UserId=@userId
              ELSE
                INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom) VALUES (@userId, @businessName, @category, @description, @workArea, @priceFrom)`);
    res.json({ message: 'Settings updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current provider's own profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .query('SELECT * FROM ProviderProfiles WHERE UserId = @userId');
    if (!result.recordset[0]) return res.status(404).json({ message: 'Not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all providers with optional filters
router.get('/', async (req, res) => {
  const { category, minRating } = req.query;
  try {
    await poolConnect;
    let query = `SELECT p.Id, p.BusinessName, p.Category, p.Description, p.WorkArea, p.PriceFrom, p.AverageRating, u.Email
                 FROM ProviderProfiles p JOIN Users u ON p.UserId = u.Id WHERE 1=1`;
    const request = pool.request();

    if (category) {
      query += ' AND p.Category = @category';
      request.input('category', sql.NVarChar, category);
    }
    if (minRating) {
      query += ' AND p.AverageRating >= @minRating';
      request.input('minRating', sql.Float, parseFloat(minRating));
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single provider with portfolio and reviews
router.get('/:id', async (req, res) => {
  try {
    await poolConnect;
    const [profile, media, reviews] = await Promise.all([
      pool.request().input('id', sql.Int, req.params.id)
        .query('SELECT p.*, u.Email FROM ProviderProfiles p JOIN Users u ON p.UserId = u.Id WHERE p.Id = @id'),
      pool.request().input('id', sql.Int, req.params.id)
        .query('SELECT FilePath FROM PortfolioMedia WHERE ProviderId = @id ORDER BY UploadedAt DESC'),
      pool.request().input('id', sql.Int, req.params.id)
        .query('SELECT r.Rating, r.Comment, r.CreatedAt, u.Email FROM Reviews r JOIN Users u ON r.CustomerId = u.Id WHERE r.ProviderId = @id ORDER BY r.CreatedAt DESC'),
    ]);

    if (!profile.recordset[0]) return res.status(404).json({ message: 'Provider not found' });
    res.json({ ...profile.recordset[0], portfolio: media.recordset, reviews: reviews.recordset });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add review (Customer only)
router.post('/:id/reviews', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Customer') return res.status(403).json({ message: 'Forbidden' });
  const { rating, comment } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input('providerId', sql.Int, req.params.id)
      .input('customerId', sql.Int, req.user.id)
      .input('rating', sql.Int, rating)
      .input('comment', sql.NVarChar, comment)
      .query('INSERT INTO Reviews (ProviderId, CustomerId, Rating, Comment) VALUES (@providerId, @customerId, @rating, @comment)');

    // Update average rating
    await pool.request().input('id', sql.Int, req.params.id)
      .query('UPDATE ProviderProfiles SET AverageRating = (SELECT AVG(CAST(Rating AS FLOAT)) FROM Reviews WHERE ProviderId = @id) WHERE Id = @id');

    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
