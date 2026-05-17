const pool = require('../config/db');

// GET Active Plans (Public view - strictly fetches from PG)
const getPublicPlans = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, price, features FROM plans WHERE is_active = true ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch public plans error:', error.message);
    res.status(500).json({ error: 'Database Plan Fetch Failure' });
  }
};

// GET All Plans (Admin view)
const getAdminPlans = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM plans ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch admin plans error:', error.message);
    res.status(500).json({ error: 'Database Admin Plan Fetch Failure' });
  }
};

// CREATE New Plan (Admin view)
const createPlan = async (req, res) => {
  const { name, price, features } = req.body;

  if (!name || price === undefined || !features) {
    return res.status(400).json({ error: 'Plan name, price, and features are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO plans (name, price, features, is_active) VALUES ($1, $2, $3, true) RETURNING *',
      [name, parseInt(price), features]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create plan error:', error.message);
    res.status(500).json({ error: 'Database Plan Creation Failure' });
  }
};

// UPDATE Subscription Plan (Admin view)
const updatePlan = async (req, res) => {
  const { id } = req.params;
  const { name, price, features, is_active } = req.body;

  if (!name || price === undefined || !features || is_active === undefined) {
    return res.status(400).json({ error: 'Name, price, features, and active status are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE plans SET name = $1, price = $2, features = $3, is_active = $4 WHERE id = $5 RETURNING *',
      [name, parseInt(price), features, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update plan error:', error.message);
    res.status(500).json({ error: 'Database Plan Update Failure' });
  }
};

// DELETE Subscription Plan (Admin view)
const deletePlan = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM plans WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }
    res.json({ message: 'Subscription plan deleted successfully' });
  } catch (error) {
    console.error('Delete plan error:', error.message);
    res.status(500).json({ error: 'Database Plan Deletion Failure' });
  }
};

module.exports = {
  getPublicPlans,
  getAdminPlans,
  createPlan,
  updatePlan,
  deletePlan
};
