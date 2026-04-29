require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/providers', require('./routes/providers'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/chat', require('./routes/chat'));

// Production Setup
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../../client/build');
  
  // הגשת הקבצים הסטטיים של React
  app.use(express.static(buildPath));

  // פתרון ל-PathError ב-Node 22: שימוש בסינטקס מפורש שתופס הכל
  app.get('*', (req, res) => {
    // אם הבקשה היא לא ל-API, נשלח את ה-index.html
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(buildPath, 'index.html'));
    }
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
  console.log('Mode:', process.env.NODE_ENV);
});