require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

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
  // השינוי הקריטי: שימוש בנתיב אבסולוטי מהשורש של הפרויקט
  const buildPath = path.join(process.cwd(), 'client', 'build');
  
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(buildPath, 'index.html'), (err) => {
        if (err) {
          console.error('Error sending index.html:', err);
          res.status(500).send('Frontend build not found. Check GitHub for client/build folder.');
        }
      });
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
});//יחי