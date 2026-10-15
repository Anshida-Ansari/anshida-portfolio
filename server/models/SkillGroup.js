import mongoose from 'mongoose';

const skillGroupSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    skills: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('SkillGroup', skillGroupSchema);
