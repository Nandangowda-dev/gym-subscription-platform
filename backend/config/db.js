const { Pool } = require('pg');
require('dotenv').config();

// Production database pooling connection (strictly connects to live PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err.message);
});

module.exports = pool;
