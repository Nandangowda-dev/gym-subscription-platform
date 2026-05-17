const express = require('express');
const router = express.Router();
const { getPublicPlans, getAdminPlans, createPlan, updatePlan, deletePlan } = require('../controllers/planController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public view
router.get('/plans', getPublicPlans);

// Admin controls
router.get('/admin/plans', authenticateToken, requireAdmin, getAdminPlans);
router.post('/admin/plans', authenticateToken, requireAdmin, createPlan);
router.put('/admin/plans/:id', authenticateToken, requireAdmin, updatePlan);
router.delete('/admin/plans/:id', authenticateToken, requireAdmin, deletePlan);

module.exports = router;
