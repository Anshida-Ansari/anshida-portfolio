import mongoose from 'mongoose';

// Singleton document — only ever one "About" record
const aboutSchema = new mongoose.Schema(
  {
    lead: { type: String, trim: true, default: '' },
    paragraphs: [{ type: String, trim: true }],
    status: { type: String, trim: true, default: 'Based in Kerala, India · Open to Remote & Relocation' },
    interests: [{ type: String, trim: true }],
    principles: [
      {
        number: { type: String, trim: true },
        title: { type: String, trim: true },
        desc: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('About', aboutSchema);
