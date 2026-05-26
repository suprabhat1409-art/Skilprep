const mongoose = require('mongoose');

const communityTestSchema = new mongoose.Schema(
  {
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    prompt: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: true },
    dueAt: { type: Date, default: null },
  },
  { timestamps: true }
);

communityTestSchema.index({ community: 1, createdAt: -1 });

module.exports = mongoose.model('CommunityTest', communityTestSchema);