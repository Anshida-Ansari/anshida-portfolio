import express from 'express';
import { body, validationResult } from 'express-validator';
import Project from '../models/Project.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const validate = [
  body('title').notEmpty().trim(),
  body('category').notEmpty().trim(),
  body('type').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('number').notEmpty().trim(),
];

// GET /api/projects — public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ visible: true })
      .sort({ order: 1, createdAt: 1 })
      .select('-__v');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/projects/all — admin (includes hidden)
router.get('/all', authenticate, async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: 1 }).select('-__v');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/projects — admin
router.post('/', authenticate, validate, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const count = await Project.countDocuments();
    const project = new Project({ ...req.body, order: req.body.order ?? count });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/projects/:id — admin
router.put('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/projects/:id — admin
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/projects/reorder — admin (update order of multiple)
router.patch('/reorder', authenticate, async (req, res) => {
  try {
    const { items } = req.body; // [{ id, order }]
    await Promise.all(
      items.map(({ id, order }) => Project.findByIdAndUpdate(id, { order }))
    );
    res.json({ message: 'Reordered' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
