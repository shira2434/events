require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const helmet = require('helmet');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors());
app.use(express.json());

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { message: 'יותר מדי ניסיונות, נסה שוב בעוד 15 דקות' } });
const reviewLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: { message: 'הגעת למגבלת הביקורות לשעה' } });
const chatLimiter = rateLimit({ windowMs: 60 * 1000, max: 60, message: { message: 'יותר מדי הודעות, האט קצת' } });

app.use('/api/auth', authLimiter);
app.use('/api/providers/:id/reviews', reviewLimiter);
app.use('/api/chat', chatLimiter);

// static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/providers', require('./routes/providers'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/admin', require('./routes/admin'));

// Production Setup
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '..', '..', 'client', 'build');
  app.use(express.static(buildPath));
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      return res.sendFile(path.join(buildPath, 'index.html'));
    }
    next();
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${req.method}] ${req.url} →`, err.message);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});