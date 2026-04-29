const { Pool } = require('pg');
const sql = require('mssql');
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