import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tech: [{ type: String, trim: true }],
    liveUrl: { type: String, trim: true, default: '' },
    repoUrl: { type: String, trim: true, default: '' },
    repoLabel: { type: String, trim: true, default: 'Repository' },
    note: { type: String, trim: true, default: '' },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
