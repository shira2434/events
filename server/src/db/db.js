const { Pool } = require('pg');
const sql = require('mssql');
require('dotenv').config();

let pool;
let poolConnect;
let isPostgres = false;

const { Pool } = require('pg');
const sql = require('mssql');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let pool;
let poolConnect;
let isPostgres = false;

if (process.env.DATABASE_URL) {
    isPostgres = true;
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    poolConnect = Promise.resolve();
    // Auto-create tables
    pool.query(`
      CREATE TABLE IF NOT EXISTS Users (
        Id SERIAL PRIMARY KEY,
        Email VARCHAR(255) UNIQUE NOT NULL,
        PasswordHash VARCHAR(255) NOT NULL,
        Role VARCHAR(20) NOT NULL CHECK (Role IN ('Customer', 'Provider')),
        CreatedAt TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS ProviderProfiles (
        Id SERIAL PRIMARY KEY,
        UserId INT UNIQUE NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
        BusinessName VARCHAR(255) NOT NULL,
        Category VARCHAR(100) NOT NULL,
        Description TEXT,
        WorkArea VARCHAR(255),
        PriceFrom INT,
        AverageRating FLOAT DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS PortfolioMedia (
        Id SERIAL PRIMARY KEY,
        ProviderId INT NOT NULL REFERENCES ProviderProfiles(Id) ON DELETE CASCADE,
        FilePath VARCHAR(500) NOT NULL,
        UploadedAt TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS ChatMessages (
        Id SERIAL PRIMARY KEY,
        SenderId INT NOT NULL REFERENCES Users(Id),
        ReceiverId INT NOT NULL REFERENCES Users(Id),
        Content TEXT NOT NULL,
        IsRead BOOLEAN DEFAULT FALSE,
        SentAt TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS Reviews (
        Id SERIAL PRIMARY KEY,
        ProviderId INT NOT NULL REFERENCES ProviderProfiles(Id) ON DELETE CASCADE,
        CustomerId INT NOT NULL REFERENCES Users(Id),
        Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
        Comment TEXT,
        CreatedAt TIMESTAMP DEFAULT NOW()
      );
    `).then(() => console.log('Tables ready')).catch(e => console.error('Table init error:', e.message));
    console.log('Connected to PostgreSQL (Cloud)');
} else {
    const config = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER || 'localhost',
        database: process.env.DB_NAME,
        options: { encrypt: false, trustServerCertificate: true },
    };
    pool = new sql.ConnectionPool(config);
    poolConnect = pool.connect();
    console.log('Connected to SQL Server (Local)');
}

// פונקציה שתעזור לך להריץ שאילתות בלי לדאוג איזה DB זה
async function executeQuery(queryString, params = []) {
    await poolConnect;
    if (isPostgres) {
        // PostgreSQL משתמש ב-$1, $2 לפרמטרים
        return pool.query(queryString, params);
    } else {
        // SQL Server משתמש בשיטה אחרת (צריך התאמה אם יש פרמטרים)
        const request = pool.request();
        return request.query(queryString);
    }
}

module.exports = { pool, poolConnect, sql, isPostgres, executeQuery };