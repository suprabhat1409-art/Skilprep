const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isPublic: { type: Boolean, default: false },
    settings: {
      resultVisibility: { type: String, enum: ['members_only', 'all_members'], default: 'members_only' },
      allowFileSharing: { type: Boolean, default: true },
      allowNotes: { type: Boolean, default: true },
    },
    invites: [
      {
        code: { type: String, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date },
        usesLeft: { type: Number, default: null },
        singleUse: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

communitySchema.index({ owner: 1 });
communitySchema.index({ members: 1 });

module.exports = mongoose.model('Community', communitySchema);