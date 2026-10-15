import express from 'express';
import About from '../models/About.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/about — public
router.get('/', async (req, res) => {
  try {
    const about = await About.findOne().select('-__v');
    if (!about) return res.json(null);
    res.json(about);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/about — admin (upsert singleton)
router.put('/', authenticate, async (req, res) => {
  try {
    const about = await About.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
    });
    res.json(about);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
