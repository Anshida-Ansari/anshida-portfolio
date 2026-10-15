import mongoose from 'mongoose';

// Singleton document — only ever one admin user
const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Admin', adminSchema);
