const mongoose = require('mongoose');

const communityResourceSchema = new mongoose.Schema(
  {
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
    kind: { type: String, enum: ['note', 'file', 'link'], default: 'note' },
    title: { type: String, required: true, trim: true },
    body: { type: String, default: '' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    fileMimeType: { type: String, default: '' },
    fileSize: { type: Number, default: 0 },
    storagePath: { type: String, default: '' },
    sharedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

communityResourceSchema.index({ community: 1, createdAt: -1 });

module.exports = mongoose.model('CommunityResource', communityResourceSchema);