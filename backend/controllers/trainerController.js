const pool = require('../config/db');

// GET Active Trainers (Public - masks PII Age, Gender, Email, Phone)
const getPublicTrainers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, specialty, image_url FROM trainers WHERE is_active = true ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch public trainers error:', error.message);
    res.status(500).json({ error: 'Database Trainer Fetch Failure' });
  }
};

// GET All Trainers (Admin Panel - returns all demographic PII)
const getAdminTrainers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trainers ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch admin trainers error:', error.message);
    res.status(500).json({ error: 'Database Admin Trainer Fetch Failure' });
  }
};

// CREATE Trainer Profile (Admin only)
const createTrainer = async (req, res) => {
  const { name, specialty, age, gender, email, phone, image_url } = req.body;

  if (!name || !specialty) {
    return res.status(400).json({ error: 'Trainer name and specialty are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO trainers (name, specialty, age, gender, email, phone, image_url, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *',
      [name, specialty, age ? parseInt(age) : null, gender || null, email || null, phone || null, image_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create trainer error:', error.message);
    res.status(500).json({ error: 'Database Trainer Profile Creation Failure' });
  }
};

// UPDATE Trainer Profile (Admin only)
const updateTrainer = async (req, res) => {
  const { id } = req.params;
  const { name, specialty, age, gender, email, phone, image_url, is_active } = req.body;

  try {
    const result = await pool.query(
      'UPDATE trainers SET name = $1, specialty = $2, age = $3, gender = $4, email = $5, phone = $6, image_url = $7, is_active = $8 WHERE id = $9 RETURNING *',
      [name, specialty, age ? parseInt(age) : null, gender || null, email || null, phone || null, image_url || null, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trainer profile not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update trainer error:', error.message);
    res.status(500).json({ error: 'Database Trainer Profile Update Failure' });
  }
};

// DELETE Trainer Profile (Admin only)
const deleteTrainer = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM trainers WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trainer profile not found' });
    }
    res.json({ message: 'Trainer profile deleted successfully' });
  } catch (error) {
    console.error('Delete trainer error:', error.message);
    res.status(500).json({ error: 'Database Trainer Deletion Failure' });
  }
};

module.exports = {
  getPublicTrainers,
  getAdminTrainers,
  createTrainer,
  updateTrainer,
  deleteTrainer
};
