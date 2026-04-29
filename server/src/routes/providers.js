const express = require('express');
const { pool } = require('../db/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ProviderProfiles WHERE UserId = $1', [req.user.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Not found' });
    const p = result.rows[0];
    res.json({ Id: p.id, UserId: p.userid, BusinessName: p.businessname, Category: p.category, Description: p.description, WorkArea: p.workarea, PriceFrom: p.pricefrom, AverageRating: p.averagerating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/settings', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Provider') return res.status(403).json({ message: 'Forbidden' });
  const { businessName, category, description, workArea, priceFrom } = req.body;
  try {
    await pool.query(`
      INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (UserId) DO UPDATE SET
        BusinessName = $2, Category = $3, Description = $4, WorkArea = $5, PriceFrom = $6
    `, [req.user.id, businessName, category, description, workArea, priceFrom || null]);
    res.json({ message: 'Settings updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  const { category, minRating } = req.query;
  try {
    let query = `SELECT p.Id, p.BusinessName, p.Category, p.Description, p.WorkArea, p.PriceFrom, p.AverageRating, u.Email
                 FROM ProviderProfiles p JOIN Users u ON p.UserId = u.Id WHERE 1=1`;
    const params = [];
    if (category) { params.push(category); query += ` AND p.Category = $${params.length}`; }
    if (minRating) { params.push(parseFloat(minRating)); query += ` AND p.AverageRating >= $${params.length}`; }
    const result = await pool.query(query, params);
    res.json(result.rows.map(p => ({
      Id: p.id, UserId: p.userid, BusinessName: p.businessname, Category: p.category,
      Description: p.description, WorkArea: p.workarea, PriceFrom: p.pricefrom,
      AverageRating: p.averagerating || 0, Email: p.email
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [profile, media, reviews] = await Promise.all([
      pool.query(`SELECT p.Id, p.UserId, p.BusinessName, p.Category, p.Description, p.WorkArea, p.PriceFrom, p.AverageRating, u.Email
                  FROM ProviderProfiles p JOIN Users u ON p.UserId = u.Id WHERE p.Id = $1`, [req.params.id]),
      pool.query('SELECT FilePath FROM PortfolioMedia WHERE ProviderId = $1 ORDER BY UploadedAt DESC', [req.params.id]),
      pool.query('SELECT r.Rating, r.Comment, r.CreatedAt, u.Email FROM Reviews r JOIN Users u ON r.CustomerId = u.Id WHERE r.ProviderId = $1 ORDER BY r.CreatedAt DESC', [req.params.id]),
    ]);
    if (!profile.rows[0]) return res.status(404).json({ message: 'Provider not found' });
    const p = profile.rows[0];
    res.json({
      Id: p.id, UserId: p.userid, BusinessName: p.businessname, Category: p.category,
      Description: p.description, WorkArea: p.workarea, PriceFrom: p.pricefrom,
      AverageRating: p.averagerating || 0, Email: p.email,
      portfolio: media.rows.map(r => ({ FilePath: r.filepath })),
      reviews: reviews.rows.map(r => ({ Rating: r.rating, Comment: r.comment, Email: r.email, CreatedAt: r.createdat }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/reviews', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Customer') return res.status(403).json({ message: 'Forbidden' });
  const { rating, comment } = req.body;
  try {
    await pool.query(
      'INSERT INTO Reviews (ProviderId, CustomerId, Rating, Comment) VALUES ($1, $2, $3, $4)',
      [req.params.id, req.user.id, rating, comment]
    );
    await pool.query(
      'UPDATE ProviderProfiles SET AverageRating = (SELECT AVG(CAST(Rating AS FLOAT)) FROM Reviews WHERE ProviderId = $1) WHERE Id = $1',
      [req.params.id]
    );
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
