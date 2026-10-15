import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    contributions: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Experience', experienceSchema);
