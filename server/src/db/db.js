const { Pool } = require('pg'); // ספרייה ל-PostgreSQL
const sql = require('mssql');   // ספרייה ל-SQL Server (הישנה שלך)
require('dotenv').config();

let pool;
let poolConnect;
let isPostgres = false;

// בדיקה: האם אנחנו ב-Railway (ענן) או במחשב המקומי?
if (process.env.DATABASE_URL) {
    // התחברות ל-PostgreSQL (Railway)
    isPostgres = true;
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // נדרש בחיבור לענן
    });
    poolConnect = Promise.resolve(); // ב-PG החיבור מתנהל מעצמו
    console.log('Connected to PostgreSQL (Cloud)');
} else {
    // התחברות ל-SQL Server (Localhost) - הקוד המקורי שלך
    const config = {
        server: process.env.DB_SERVER || 'localhost',
        port: 1433,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        options: { encrypt: false, trustServerCertificate: true },
    };
    pool = new sql.ConnectionPool(config);
    poolConnect = pool.connect();
    console.log('Connected to SQL Server (Local)');
}

// טיפול בשגיאות
pool.on('error', (err) => console.error('DB Pool Error:', err));

module.exports = { pool, poolConnect, sql, isPostgres };