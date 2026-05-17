require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');
const trainerRoutes = require('./routes/trainerRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Security and Policy Middlewares
app.use(cors());
app.use(express.json());

// Strict HTTP Security Headers (Preventing XSS, framing, and clickjacking)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Mounting Sub-Routers
app.use('/api/auth', authRoutes);
app.use('/api', planRoutes);
app.use('/api', trainerRoutes);

// Base Check Endpoints
app.get('/', (req, res) => {
  res.json({ message: 'FITCORE Gym Production API is fully operational...' });
});

// Global 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Global Centralized Security Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled System Error:', err.message);
  res.status(500).json({ error: 'Critical server exception occurred.' });
});

// Start listening
app.listen(port, () => {
  console.log(`[FITCORE API] Production server is actively listening on port ${port}...`);
});
