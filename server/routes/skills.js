import express from 'express';
import SkillGroup from '../models/SkillGroup.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/skills — public
router.get('/', async (req, res) => {
  try {
    const groups = await SkillGroup.find({ visible: true })
      .sort({ order: 1, createdAt: 1 })
      .select('-__v');
    res.json(groups);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/skills/all — admin (includes hidden)
router.get('/all', authenticate, async (req, res) => {
  try {
    const groups = await SkillGroup.find().sort({ order: 1, createdAt: 1 }).select('-__v');
    res.json(groups);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/skills — admin
router.post('/', authenticate, async (req, res) => {
  try {
    const count = await SkillGroup.countDocuments();
    const group = new SkillGroup({ ...req.body, order: req.body.order ?? count });
    await group.save();
    res.status(201).json(group);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/skills/:id — admin
router.put('/:id', authenticate, async (req, res) => {
  try {
    const group = await SkillGroup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!group) return res.status(404).json({ message: 'Skill group not found' });
    res.json(group);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/skills/:id — admin
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const group = await SkillGroup.findByIdAndDelete(req.params.id);
    if (!group) return res.status(404).json({ message: 'Skill group not found' });
    res.json({ message: 'Skill group deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
