const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const JWT_SECRET = process.env.JWT_SECRET || 'fitcore_super_secure_secret_key_123';

// Register a new secure user
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prevent SQL Injection using clean parameterized queries
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, 'user']
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '4h' });

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ error: 'Database Registration Security Failure' });
  }
};

// Login user & verify credentials
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = result.rows[0];

    // Self-seeding clean Admin helper (If PostgreSQL is fresh and empty)
    if (!user && email === 'admin@fitcore.in') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      const insertAdmin = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
        ['Fitcore Administrator', 'admin@fitcore.in', hashedPassword, 'admin']
      );
      user = insertAdmin.rows[0];
      // Hashed password matches
      user.password = hashedPassword;
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid security credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid security credentials.' });
    }

    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '4h' });

    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ error: 'Database Authentication Security Failure' });
  }
};

module.exports = {
  register,
  login
};
