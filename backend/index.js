require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fitcore_super_secure_secret_key_123';

// Middleware
app.use(cors());
app.use(express.json());

// Security Headers (Inline Helmet)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Supports Render env
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

let dbConnected = false;

// Graceful pool connection
pool.connect()
  .then(client => {
    console.log('Connected to PostgreSQL database successfully.');
    dbConnected = true;
    client.release();
  })
  .catch(err => {
    console.warn('Warning: Could not connect to PostgreSQL. Operating in Secure In-Memory Mode.');
    console.warn('Reason:', err.message);
  });

// In-Memory Database Fallbacks (To keep application 100% operational instantly)
let inMemoryPlans = [
  { id: 1, name: 'Basic', price: 1499, features: ['Full gym access', 'Locker room access', '1 complementary fitness assessment'], is_active: true },
  { id: 2, name: 'Premium', price: 2999, features: ['Full gym access', 'Locker room access', 'Unlimited group classes', 'Custom workout plan'], is_active: true },
  { id: 3, name: 'Pro', price: 5999, features: ['Full gym access', 'Locker room & Sauna', 'Unlimited group classes', '4x Personal training/mo', 'Nutrition guide'], is_active: true }
];

let inMemoryTrainers = [
  { id: 1, name: 'Coach Rajesh', specialty: 'Bodybuilding & Strength', is_active: true },
  { id: 2, name: 'Coach Priya', specialty: 'CrossFit & Cardio', is_active: true },
  { id: 3, name: 'Coach Amit', specialty: 'Yoga & Core Recovery', is_active: true }
];

// Pre-seeded Admin User (For secure access)
const defaultAdmin = {
  email: 'admin@fitcore.in',
  passwordHash: bcrypt.hashSync('admin123', 10), // secure hash
  name: 'Fitcore Administrator',
  role: 'admin'
};

let inMemoryUsers = [defaultAdmin];

// JWT Authentication Middleware (Security Gate)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. Security token missing.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired security token.' });
    req.user = user;
    next();
  });
};

// Admin Only Security Gate
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }
  next();
};

// ==========================================
// 1. AUTHENTICATION ENDPOINTS (SECURE)
// ==========================================

// Register Route
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.reqValidateBody = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (dbConnected) {
      // Secure Parameterized Query (SQL Injection Prevention)
      const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      const result = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
        [name, email, hashedPassword, 'user']
      );
      const user = result.rows[0];
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
      return res.json({ token, user });
    } else {
      const exists = inMemoryUsers.find(u => u.email === email);
      if (exists) return res.status(400).json({ error: 'Email already exists' });

      const newUser = { id: inMemoryUsers.length + 1, name, email, passwordHash: hashedPassword, role: 'user' };
      inMemoryUsers.push(newUser);

      const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '2h' });
      return res.json({ token, user: { name: newUser.name, email: newUser.email, role: newUser.role } });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Security Registration Error' });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user;
    if (dbConnected) {
      // Secure Parameterized Query (SQL Injection Prevention)
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      user = result.rows[0];
    } else {
      user = inMemoryUsers.find(u => u.email === email);
    }

    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const passwordHash = dbConnected ? user.password : user.passwordHash;
    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const payload = { id: user.id || 1, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '4h' });

    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Security Login Error' });
  }
});

// ==========================================
// 2. DYNAMIC PLANS ENDPOINTS
// ==========================================

// GET Active Plans (Public Site)
app.get('/api/plans', async (req, res) => {
  try {
    if (dbConnected) {
      const result = await pool.query('SELECT * FROM plans WHERE is_active = true ORDER BY id ASC');
      res.json(result.rows);
    } else {
      const activePlans = inMemoryPlans.filter(p => p.is_active);
      res.json(activePlans);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active plans' });
  }
});

// GET All Plans (Admin Control Panel)
app.get('/api/admin/plans', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (dbConnected) {
      const result = await pool.query('SELECT * FROM plans ORDER BY id ASC');
      res.json(result.rows);
    } else {
      res.json(inMemoryPlans);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin plans' });
  }
});

// UPDATE Plan Price/Active Status (Admin Only)
app.put('/api/admin/plans/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { price, is_active } = req.body;

  if (price === undefined || is_active === undefined) {
    return res.status(400).json({ error: 'Price and Active status are required' });
  }

  try {
    if (dbConnected) {
      // Secure Parameterized Update
      const result = await pool.query(
        'UPDATE plans SET price = $1, is_active = $2 WHERE id = $3 RETURNING *',
        [price, is_active, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Plan not found' });
      res.json(result.rows[0]);
    } else {
      const idx = inMemoryPlans.findIndex(p => p.id === parseInt(id));
      if (idx === -1) return res.status(404).json({ error: 'Plan not found' });
      
      inMemoryPlans[idx].price = parseInt(price);
      inMemoryPlans[idx].is_active = !!is_active;
      res.json(inMemoryPlans[idx]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Admin plan update error' });
  }
});

// ==========================================
// 3. DYNAMIC TRAINERS ENDPOINTS
// ==========================================

// GET Active Trainers (Public Site)
app.get('/api/trainers', async (req, res) => {
  try {
    if (dbConnected) {
      const result = await pool.query('SELECT * FROM trainers WHERE is_active = true ORDER BY id ASC');
      res.json(result.rows);
    } else {
      const activeTrainers = inMemoryTrainers.filter(t => t.is_active);
      res.json(activeTrainers);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active trainers' });
  }
});

// GET All Trainers (Admin Panel)
app.get('/api/admin/trainers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (dbConnected) {
      const result = await pool.query('SELECT * FROM trainers ORDER BY id ASC');
      res.json(result.rows);
    } else {
      res.json(inMemoryTrainers);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin trainers' });
  }
});

// ADD New Trainer (Admin Only)
app.post('/api/admin/trainers', authenticateToken, requireAdmin, async (req, res) => {
  const { name, specialty } = req.body;

  if (!name || !specialty) {
    return res.status(400).json({ error: 'Trainer name and specialty are required' });
  }

  try {
    if (dbConnected) {
      const result = await pool.query(
        'INSERT INTO trainers (name, specialty, is_active) VALUES ($1, $2, true) RETURNING *',
        [name, specialty]
      );
      res.status(211).json(result.rows[0]);
    } else {
      const newTrainer = { id: inMemoryTrainers.length + 1, name, specialty, is_active: true };
      inMemoryTrainers.push(newTrainer);
      res.json(newTrainer);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trainer' });
  }
});

// UPDATE Trainer Status/Details (Admin Only)
app.put('/api/admin/trainers/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, specialty, is_active } = req.body;

  try {
    if (dbConnected) {
      const result = await pool.query(
        'UPDATE trainers SET name = $1, specialty = $2, is_active = $3 WHERE id = $4 RETURNING *',
        [name, specialty, is_active, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Trainer not found' });
      res.json(result.rows[0]);
    } else {
      const idx = inMemoryTrainers.findIndex(t => t.id === parseInt(id));
      if (idx === -1) return res.status(404).json({ error: 'Trainer not found' });

      inMemoryTrainers[idx].name = name;
      inMemoryTrainers[idx].specialty = specialty;
      inMemoryTrainers[idx].is_active = !!is_active;
      res.json(inMemoryTrainers[idx]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trainer' });
  }
});

// DELETE Trainer (Admin Only)
app.delete('/api/admin/trainers/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    if (dbConnected) {
      await pool.query('DELETE FROM trainers WHERE id = $1', [id]);
      res.json({ message: 'Trainer deleted successfully' });
    } else {
      const idx = inMemoryTrainers.findIndex(t => t.id === parseInt(id));
      if (idx === -1) return res.status(404).json({ error: 'Trainer not found' });

      inMemoryTrainers.splice(idx, 1);
      res.json({ message: 'Trainer deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trainer' });
  }
});

app.get('/', (req, res) => {
  res.send('FITCORE Gym API is running secure...');
});

// Start server
app.listen(port, () => {
  console.log(`Secure Server is running on port ${port}`);
});
