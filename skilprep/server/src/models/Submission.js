const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
    answer: { type: mongoose.Schema.Types.Mixed, required: true },
    kind: { type: String, enum: ['submission', 'run'], default: 'submission' },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'running', 'accepted', 'wrong_answer', 'time_limit', 'runtime_error', 'compile_error'],
    },
    testResults: [
      {
        testCaseId: mongoose.Schema.Types.ObjectId,
        passed: Boolean,
        actualOutput: String,
        executionTimeMs: Number,
        memoryUsedKb: Number,
        error: String,
      },
    ],
    score: { type: Number, default: 0 },
    executionTimeMs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

submissionSchema.index({ user: 1, problem: 1, createdAt: -1 });
submissionSchema.index({ user: 1, status: 1 });
submissionSchema.index({ field: 1, status: 1, score: -1 });
submissionSchema.index({ problem: 1, status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
