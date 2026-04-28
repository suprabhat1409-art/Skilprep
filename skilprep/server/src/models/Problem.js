const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
    difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
    tags: [{ type: String, trim: true, lowercase: true }],
    description: { type: String, required: true },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    baseScore: { type: Number, default: 10 },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: true },
    solveCount: { type: Number, default: 0 },
    attemptCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

problemSchema.index({ field: 1, difficulty: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ field: 1, isPublished: 1 });

module.exports = mongoose.model('Problem', problemSchema);
