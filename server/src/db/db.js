const sql = require('mssql');
require('dotenv').config();

const config = {
  server: 'localhost',
  port: 1433,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: { encrypt: false, trustServerCertificate: true },
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

pool.on('error', (err) => console.error('DB Pool Error:', err));

module.exports = { pool, poolConnect, sql };
