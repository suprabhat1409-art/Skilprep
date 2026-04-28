const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema(
  {
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    input: { type: String, default: '' },
    expectedOutput: { type: String, required: true },
    isSample: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

testCaseSchema.index({ problem: 1, sortOrder: 1 });

module.exports = mongoose.model('TestCase', testCaseSchema);
