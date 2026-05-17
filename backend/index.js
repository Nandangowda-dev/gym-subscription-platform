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

// In-Memory Database Fallbacks
let inMemoryPlans = [
  { id: 1, name: 'Basic', price: 1499, features: ['Full gym access', 'Locker room access', '1 complementary fitness assessment'], is_active: true },
  { id: 2, name: 'Premium', price: 2999, features: ['Full gym access', 'Locker room access', 'Unlimited group classes', 'Custom workout plan'], is_active: true },
  { id: 3, name: 'Pro', price: 5999, features: ['Full gym access', 'Locker room & Sauna', 'Unlimited group classes', '4x Personal training/mo', 'Nutrition guide'], is_active: true }
];

let inMemoryTrainers = [
  { 
    id: 1, 
    name: 'Coach Rajesh', 
    specialty: 'Bodybuilding & Strength', 
    age: 32, 
    gender: 'Male', 
    email: 'rajesh@fitcore.in', 
    phone: '+91 98765 43210', 
    image_url: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=80', 
    is_active: true 
  },
  { 
    id: 2, 
    name: 'Coach Priya', 
    specialty: 'CrossFit & Cardio', 
    age: 28, 
    gender: 'Female', 
    email: 'priya@fitcore.in', 
    phone: '+91 87654 32109', 
    image_url: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&auto=format&fit=crop&q=80', 
    is_active: true 
  },
  { 
    id: 3, 
    name: 'Coach Amit', 
    specialty: 'Yoga & Core Recovery', 
    age: 35, 
    gender: 'Male', 
    email: 'amit@fitcore.in', 
    phone: '+91 76543 21098', 
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 
    is_active: true 
  }
];

// Pre-seeded Admin User (For secure access)
const defaultAdmin = {
  email: 'admin@fitcore.in',
  passwordHash: bcrypt.hashSync('admin123', 10), // secure hash
  name: 'Fitcore Administrator',
  role: 'admin'
};

let inMemoryUsers = [defaultAdmin];

// JWT Authentication Middleware
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
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

// Register Route
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (dbConnected) {
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

// GET Active Plans (Public Site - returns active only)
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

// ADD New Subscription Plan (Admin Only - Dynamic Options!)
app.post('/api/admin/plans', authenticateToken, requireAdmin, async (req, res) => {
  const { name, price, features } = req.body;

  if (!name || price === undefined || !features) {
    return res.status(400).json({ error: 'Plan name, price, and features are required' });
  }

  try {
    if (dbConnected) {
      const result = await pool.query(
        'INSERT INTO plans (name, price, features, is_active) VALUES ($1, $2, $3, true) RETURNING *',
        [name, parseInt(price), features]
      );
      res.status(201).json(result.rows[0]);
    } else {
      const newPlan = { 
        id: inMemoryPlans.length + 1, 
        name, 
        price: parseInt(price), 
        features, 
        is_active: true 
      };
      inMemoryPlans.push(newPlan);
      res.status(201).json(newPlan);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create subscription plan' });
  }
});

// UPDATE Plan Details, Features & Price (Admin Only)
app.put('/api/admin/plans/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, price, features, is_active } = req.body;

  if (!name || price === undefined || !features || is_active === undefined) {
    return res.status(400).json({ error: 'Name, price, features, and active status are required' });
  }

  try {
    if (dbConnected) {
      const result = await pool.query(
        'UPDATE plans SET name = $1, price = $2, features = $3, is_active = $4 WHERE id = $5 RETURNING *',
        [name, parseInt(price), features, is_active, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Plan not found' });
      res.json(result.rows[0]);
    } else {
      const idx = inMemoryPlans.findIndex(p => p.id === parseInt(id));
      if (idx === -1) return res.status(404).json({ error: 'Plan not found' });
      
      inMemoryPlans[idx].name = name;
      inMemoryPlans[idx].price = parseInt(price);
      inMemoryPlans[idx].features = features;
      inMemoryPlans[idx].is_active = !!is_active;
      res.json(inMemoryPlans[idx]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Admin plan update error' });
  }
});

// DELETE Subscription Plan (Admin Only)
app.delete('/api/admin/plans/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    if (dbConnected) {
      await pool.query('DELETE FROM plans WHERE id = $1', [id]);
      res.json({ message: 'Plan deleted successfully' });
    } else {
      const idx = inMemoryPlans.findIndex(p => p.id === parseInt(id));
      if (idx === -1) return res.status(404).json({ error: 'Plan not found' });

      inMemoryPlans.splice(idx, 1);
      res.json({ message: 'Plan deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

// ==========================================
// 3. DYNAMIC SECURE TRAINERS ENDPOINTS
// ==========================================

// GET Active Trainers (Public Landing Page - STRICT MASKS FOR PRIVACY!)
// Masks PII: Age, Gender, Email, and Phone are completely hidden from non-admin requests!
app.get('/api/trainers', async (req, res) => {
  try {
    if (dbConnected) {
      // Secure Select: Explicitly fetch only non-PII fields
      const result = await pool.query('SELECT id, name, specialty, image_url FROM trainers WHERE is_active = true ORDER BY id ASC');
      res.json(result.rows);
    } else {
      // In-Memory mask filter
      const activeTrainersMasked = inMemoryTrainers
        .filter(t => t.is_active)
        .map(({ id, name, specialty, image_url }) => ({ id, name, specialty, image_url }));
      res.json(activeTrainersMasked);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active trainers' });
  }
});

// GET All Trainers (Admin Panel - Returns all fields for secure database management)
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

// ADD New Trainer (Admin Only - Collects full secure demographic profile details)
app.post('/api/admin/trainers', authenticateToken, requireAdmin, async (req, res) => {
  const { name, specialty, age, gender, email, phone, image_url } = req.body;

  if (!name || !specialty) {
    return res.status(400).json({ error: 'Trainer name and specialty are required' });
  }

  try {
    if (dbConnected) {
      const result = await pool.query(
        'INSERT INTO trainers (name, specialty, age, gender, email, phone, image_url, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *',
        [name, specialty, age ? parseInt(age) : null, gender || null, email || null, phone || null, image_url || null]
      );
      res.status(201).json(result.rows[0]);
    } else {
      const newTrainer = { 
        id: inMemoryTrainers.length + 1, 
        name, 
        specialty, 
        age: age ? parseInt(age) : null, 
        gender: gender || null, 
        email: email || null, 
        phone: phone || null, 
        image_url: image_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&auto=format&fit=crop&q=80', 
        is_active: true 
      };
      inMemoryTrainers.push(newTrainer);
      res.status(201).json(newTrainer);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create trainer profile' });
  }
});

// UPDATE Trainer Profile Details (Admin Only)
app.put('/api/admin/trainers/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, specialty, age, gender, email, phone, image_url, is_active } = req.body;

  try {
    if (dbConnected) {
      const result = await pool.query(
        'UPDATE trainers SET name = $1, specialty = $2, age = $3, gender = $4, email = $5, phone = $6, image_url = $7, is_active = $8 WHERE id = $9 RETURNING *',
        [name, specialty, age ? parseInt(age) : null, gender || null, email || null, phone || null, image_url || null, is_active, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Trainer not found' });
      res.json(result.rows[0]);
    } else {
      const idx = inMemoryTrainers.findIndex(t => t.id === parseInt(id));
      if (idx === -1) return res.status(404).json({ error: 'Trainer not found' });

      inMemoryTrainers[idx].name = name;
      inMemoryTrainers[idx].specialty = specialty;
      inMemoryTrainers[idx].age = age ? parseInt(age) : null;
      inMemoryTrainers[idx].gender = gender || null;
      inMemoryTrainers[idx].email = email || null;
      inMemoryTrainers[idx].phone = phone || null;
      inMemoryTrainers[idx].image_url = image_url || null;
      inMemoryTrainers[idx].is_active = !!is_active;
      res.json(inMemoryTrainers[idx]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trainer profile' });
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
