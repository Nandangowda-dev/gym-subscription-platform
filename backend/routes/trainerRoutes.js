const express = require('express');
const router = express.Router();
const { getPublicTrainers, getAdminTrainers, createTrainer, updateTrainer, deleteTrainer } = require('../controllers/trainerController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public view
router.get('/trainers', getPublicTrainers);

// Admin controls
router.get('/admin/trainers', authenticateToken, requireAdmin, getAdminTrainers);
router.post('/admin/trainers', authenticateToken, requireAdmin, createTrainer);
router.put('/admin/trainers/:id', authenticateToken, requireAdmin, updateTrainer);
router.delete('/admin/trainers/:id', authenticateToken, requireAdmin, deleteTrainer);

module.exports = router;
