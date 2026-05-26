const mongoose = require('mongoose');

const communitySubmissionSchema = new mongoose.Schema(
  {
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
    communityTest: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityTest', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answer: { type: String, required: true },
    score: { type: Number, default: 0 },
    feedback: { type: String, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    status: { type: String, enum: ['submitted', 'reviewed'], default: 'submitted' },
  },
  { timestamps: true }
);

communitySubmissionSchema.index({ communityTest: 1, createdAt: -1 });
communitySubmissionSchema.index({ community: 1, user: 1, createdAt: -1 });

module.exports = mongoose.model('CommunitySubmission', communitySubmissionSchema);