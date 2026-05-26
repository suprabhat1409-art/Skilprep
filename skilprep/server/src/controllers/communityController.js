const Joi = require('joi');
const Community = require('../models/Community');
const CommunityTest = require('../models/CommunityTest');
const CommunitySubmission = require('../models/CommunitySubmission');
const CommunityResource = require('../models/CommunityResource');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const communitySchema = Joi.object({
  name: Joi.string().min(3).max(120).required(),
  slug: Joi.string().min(3).max(120).required(),
  description: Joi.string().allow('').max(1000),
  isPublic: Joi.boolean().default(false),
});

const testSchema = Joi.object({
  title: Joi.string().min(3).max(160).required(),
  description: Joi.string().allow('').max(1000),
  prompt: Joi.string().min(5).max(5000).required(),
  dueAt: Joi.date().iso().allow(null),
});

const submissionSchema = Joi.object({
  answer: Joi.string().min(1).max(5000).required(),
});

const reviewSchema = Joi.object({
  score: Joi.number().min(0).max(100).required(),
  feedback: Joi.string().allow('').max(5000),
});

const resourceSchema = Joi.object({
  kind: Joi.string().valid('note', 'file', 'link').required(),
  title: Joi.string().min(2).max(160).required(),
  body: Joi.string().allow('').max(10000),
  fileName: Joi.string().allow('').max(255),
  fileUrl: Joi.string().allow('').uri({ scheme: ['http', 'https'] }).max(2000),
});

function entityId(value) {
  return value && typeof value === 'object' && value._id ? value._id.toString() : value?.toString();
}

function isMember(community, userId) {
  const targetId = entityId(userId);
  const ownerId = entityId(community.owner);
  const memberIds = (community.members || []).map((member) => entityId(member));
  return ownerId === targetId || memberIds.includes(targetId);
}

function canSeeAllResults(community, user) {
  return !!user && (user.role === 'admin' || entityId(community.owner) === entityId(user._id));
}

exports.listCommunities = asyncHandler(async (req, res) => {
  const filter = req.user
    ? { $or: [{ isPublic: true }, { owner: req.user._id }, { members: req.user._id }] }
    : { isPublic: true };

  const communities = await Community.find(filter)
    .populate('owner', 'username avatar role')
    .sort({ createdAt: -1 });

  res.json({ communities });
});

exports.createCommunity = asyncHandler(async (req, res) => {
  const { error } = communitySchema.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);

  const exists = await Community.findOne({ slug: req.body.slug });
  if (exists) throw new ApiError(400, 'Community slug already exists');

  const community = await Community.create({
    ...req.body,
    owner: req.user._id,
    members: [req.user._id],
  });

  await community.populate('owner', 'username avatar role');
  res.status(201).json({ community });
});

exports.joinCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.communityId);
  if (!community) throw new ApiError(404, 'Community not found');

  if (!community.members.some((memberId) => memberId.toString() === req.user._id.toString())) {
    community.members.push(req.user._id);
    await community.save();
  }

  res.json({ communityId: community._id, joined: true });
});

exports.getCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findOne({ slug: req.params.slug })
    .populate('owner', 'username avatar role')
    .populate('members', 'username avatar role');

  if (!community) throw new ApiError(404, 'Community not found');
  if (!community.isPublic && (!req.user || !isMember(community, req.user._id))) {
    throw new ApiError(403, 'Join this community to view it');
  }

  const tests = await CommunityTest.find({ community: community._id, isPublished: true })
    .populate('createdBy', 'username avatar role')
    .sort({ createdAt: -1 });

  const resources = await CommunityResource.find({ community: community._id })
    .populate('sharedBy', 'username avatar role')
    .sort({ createdAt: -1 });

  const userCanSeeAll = canSeeAllResults(community, req.user);
  const testIds = tests.map((test) => test._id);
  const submissionFilter = req.user
    ? {
        community: community._id,
        communityTest: { $in: testIds },
        ...(userCanSeeAll ? {} : { user: req.user._id }),
      }
    : { community: community._id, communityTest: { $in: [] } };

  const submissions = await CommunitySubmission.find(submissionFilter)
    .populate('user', 'username avatar role')
    .populate('reviewedBy', 'username avatar role')
    .sort({ createdAt: -1 });

  res.json({
    community,
    tests,
    resources,
    submissions,
    viewer: {
      canSeeAllResults: userCanSeeAll,
      isMember: req.user ? isMember(community, req.user._id) : false,
    },
  });
});

exports.createCommunityTest = asyncHandler(async (req, res) => {
  const { error } = testSchema.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);

  const community = await Community.findById(req.params.communityId);
  if (!community) throw new ApiError(404, 'Community not found');
  if (!isMember(community, req.user._id)) throw new ApiError(403, 'Join the community first');

  const test = await CommunityTest.create({
    ...req.body,
    community: community._id,
    createdBy: req.user._id,
  });

  res.status(201).json({ test });
});

exports.submitCommunityTest = asyncHandler(async (req, res) => {
  const { error } = submissionSchema.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);

  const community = await Community.findById(req.params.communityId);
  if (!community) throw new ApiError(404, 'Community not found');
  if (!isMember(community, req.user._id)) throw new ApiError(403, 'Join the community first');

  const test = await CommunityTest.findOne({ _id: req.params.testId, community: community._id });
  if (!test) throw new ApiError(404, 'Community test not found');

  const submission = await CommunitySubmission.create({
    community: community._id,
    communityTest: test._id,
    user: req.user._id,
    answer: req.body.answer,
    status: 'submitted',
  });

  await submission.populate('user', 'username avatar role');
  res.status(201).json({ submission });
});

exports.reviewCommunitySubmission = asyncHandler(async (req, res) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);

  const community = await Community.findById(req.params.communityId);
  if (!community) throw new ApiError(404, 'Community not found');
  if (!canSeeAllResults(community, req.user)) throw new ApiError(403, 'Only the creator or admin can review submissions');

  const submission = await CommunitySubmission.findOne({
    _id: req.params.submissionId,
    community: community._id,
    communityTest: req.params.testId,
  });
  if (!submission) throw new ApiError(404, 'Submission not found');

  submission.score = req.body.score;
  submission.feedback = req.body.feedback || '';
  submission.reviewedBy = req.user._id;
  submission.reviewedAt = new Date();
  submission.status = 'reviewed';
  await submission.save();

  await submission.populate('user', 'username avatar role');
  await submission.populate('reviewedBy', 'username avatar role');
  res.json({ submission });
});

exports.createCommunityResource = asyncHandler(async (req, res) => {
  const { error } = resourceSchema.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);

  const community = await Community.findById(req.params.communityId);
  if (!community) throw new ApiError(404, 'Community not found');
  if (!isMember(community, req.user._id)) throw new ApiError(403, 'Join the community first');

  const resource = await CommunityResource.create({
    ...req.body,
    community: community._id,
    sharedBy: req.user._id,
  });

  await resource.populate('sharedBy', 'username avatar role');
  res.status(201).json({ resource });
});

exports.uploadCommunityResource = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');

  const community = await Community.findById(req.params.communityId);
  if (!community) throw new ApiError(404, 'Community not found');
  if (!isMember(community, req.user._id)) throw new ApiError(403, 'Join the community first');

  const file = req.file;
  const fileUrl = `/uploads/communities/${file.filename}`;

  const resource = await CommunityResource.create({
    community: community._id,
    kind: 'file',
    title: req.body.title || file.originalname,
    body: req.body.body || '',
    fileName: file.originalname,
    fileUrl,
    fileMimeType: file.mimetype,
    fileSize: file.size,
    storagePath: file.path,
    sharedBy: req.user._id,
  });

  await resource.populate('sharedBy', 'username avatar role');
  res.status(201).json({ resource });
});

function makeInviteCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

exports.generateInvite = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.communityId);
  if (!community) throw new ApiError(404, 'Community not found');
  if (entityId(community.owner) !== entityId(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Only owner or admin may generate invites');
  }

  const { expiresAt, usesLeft, singleUse } = req.body || {};
  const code = makeInviteCode();
  const invite = { code, createdBy: req.user._id, expiresAt: expiresAt ? new Date(expiresAt) : null, usesLeft: usesLeft || null, singleUse: !!singleUse };
  community.invites = community.invites || [];
  community.invites.push(invite);
  await community.save();

  res.status(201).json({ invite: { code: invite.code, expiresAt: invite.expiresAt, usesLeft: invite.usesLeft, singleUse: invite.singleUse } });
});

exports.listInvites = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.communityId).populate('invites.createdBy', 'username');
  if (!community) throw new ApiError(404, 'Community not found');
  if (entityId(community.owner) !== entityId(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Only owner or admin may view invites');
  }

  res.json({ invites: community.invites || [] });
});

exports.joinWithCode = asyncHandler(async (req, res) => {
  const { code } = req.body || {};
  if (!code) throw new ApiError(400, 'Invite code required');
  const community = await Community.findOne({ 'invites.code': code });
  if (!community) throw new ApiError(404, 'Invite code not valid');

  const invite = (community.invites || []).find((i) => i.code === code);
  if (!invite) throw new ApiError(404, 'Invite not found');
  if (invite.expiresAt && new Date() > new Date(invite.expiresAt)) throw new ApiError(410, 'Invite expired');
  if (invite.usesLeft === 0) throw new ApiError(410, 'Invite has no remaining uses');

  if (!community.members.some((m) => m.toString() === req.user._id.toString())) {
    community.members.push(req.user._id);
  }

  if (invite.singleUse) {
    community.invites = community.invites.filter((i) => i.code !== code);
  } else if (typeof invite.usesLeft === 'number') {
    invite.usesLeft = Math.max(0, invite.usesLeft - 1);
  }

  await community.save();

  res.json({ communityId: community._id, joined: true });
});