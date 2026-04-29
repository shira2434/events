require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/providers', require('./routes/providers'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/chat', require('./routes/chat'));

// Production Setup
if (process.env.NODE_ENV === 'production') {
  // path.resolve מוודא שאנחנו בונים נתיב נכון יחסית לתיקייה הנוכחית
  const buildPath = path.resolve(__dirname, '../../client/build');
  
  app.use(express.static(buildPath));

  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      // כאן התיקון הקריטי לנתיב הקובץ
      return res.sendFile(path.join(buildPath, 'index.html'));
    }
    next();
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(`[${req.method}] ${req.url} →`, err.message);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});