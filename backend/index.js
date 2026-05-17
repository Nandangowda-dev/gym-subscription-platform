require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'gym_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Test DB Connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release();
});

// Routes
app.get('/', (req, res) => {
  res.send('FITCORE Gym API is running');
});

// Get Plans Route
app.get('/api/plans', async (req, res) => {
  try {
    // In a real app, you would fetch these from the database
    // const result = await pool.query('SELECT * FROM plans');
    // res.json(result.rows);
    
    // Mock data for initial setup
    const plans = [
      { id: 1, name: 'Basic', price: 29, features: ['Full gym access', 'Locker room access'] },
      { id: 2, name: 'Premium', price: 49, features: ['Full gym access', 'Unlimited group classes'] },
      { id: 3, name: 'Pro', price: 99, features: ['Full gym access', '4x Personal training/mo'] },
    ];
    res.json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
