require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 1. API Routes (חייבים לבוא לפני ה-Static Files)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/providers', require('./routes/providers'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/chat', require('./routes/chat'));

// 2. Production Setup
if (process.env.NODE_ENV === 'production') {
 const buildPath = path.resolve(__dirname, '..', '..', 'client', 'build');
  
  // הגשת קבצים סטטיים
  app.use(express.static(buildPath));

  // פתרון עוקף לשגיאת PathError: 
  // משתמשים ב-Middleware שתופס הכל במקום app.get('*')
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      return res.sendFile(path.join(buildPath, 'index.html'));
    }
    next();
  });
}

// 3. Error handling
app.use((err, req, res, next) => {
  console.error(`[${req.method}] ${req.url} →`, err.message);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('PostgreSQL: Connected');
});