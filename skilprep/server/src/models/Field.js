const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    color: { type: String, default: '#6366f1' },
    isActive: { type: Boolean, default: true },
    solverType: {
      type: String,
      required: true,
      enum: ['code', 'math', 'mcq', 'short_answer'],
    },
    config: { type: mongoose.Schema.Types.Mixed, default: {} },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Field', fieldSchema);
