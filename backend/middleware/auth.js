const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fitcore_super_secure_secret_key_123';

// JWT Token Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Security token missing.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired security token.' });
    }
    req.user = user;
    next();
  });
};

// Admin Protection Middleware
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin
};
