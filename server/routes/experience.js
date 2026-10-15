import express from 'express';
import Experience from '../models/Experience.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/experience — public
router.get('/', async (req, res) => {
  try {
    const items = await Experience.find({ visible: true })
      .sort({ order: 1, createdAt: 1 })
      .select('-__v');
    res.json(items);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/experience/all — admin
router.get('/all', authenticate, async (req, res) => {
  try {
    const items = await Experience.find().sort({ order: 1, createdAt: 1 }).select('-__v');
    res.json(items);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/experience — admin
router.post('/', authenticate, async (req, res) => {
  try {
    const count = await Experience.countDocuments();
    const item = new Experience({ ...req.body, order: req.body.order ?? count });
    await item.save();
    res.status(201).json(item);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/experience/:id — admin
router.put('/:id', authenticate, async (req, res) => {
  try {
    const item = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Experience not found' });
    res.json(item);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/experience/:id — admin
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const item = await Experience.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Experience not found' });
    res.json({ message: 'Experience deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
