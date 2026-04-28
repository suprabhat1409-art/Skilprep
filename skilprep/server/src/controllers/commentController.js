const Comment = require('../models/Comment');
const Problem = require('../models/Problem');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.getProblemComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ problem: req.params.problemId })
    .populate('author', 'username avatar role')
    .sort({ createdAt: 1 });

  res.json({ comments });
});

exports.createComment = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const { body, parentComment = null } = req.body;

  if (!body || !body.trim()) throw new ApiError(400, 'Comment body is required');

  const problem = await Problem.findById(problemId);
  if (!problem) throw new ApiError(404, 'Problem not found');

  if (parentComment) {
    const parent = await Comment.findById(parentComment);
    if (!parent) throw new ApiError(404, 'Parent comment not found');
  }

  const comment = await Comment.create({
    problem: problemId,
    author: req.user._id,
    parentComment,
    body: body.trim(),
  });

  await comment.populate('author', 'username avatar role');
  res.status(201).json({ comment });
});

exports.voteComment = asyncHandler(async (req, res) => {
  const { direction } = req.body;
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) throw new ApiError(404, 'Comment not found');
  if (!['up', 'down'].includes(direction)) throw new ApiError(400, 'direction must be up or down');

  const userId = req.user._id.toString();
  const hasUpvoted = comment.upvotedBy.some((id) => id.toString() === userId);
  const hasDownvoted = comment.downvotedBy.some((id) => id.toString() === userId);

  comment.upvotedBy = comment.upvotedBy.filter((id) => id.toString() !== userId);
  comment.downvotedBy = comment.downvotedBy.filter((id) => id.toString() !== userId);

  if (direction === 'up' && !hasUpvoted) comment.upvotedBy.push(req.user._id);
  if (direction === 'down' && !hasDownvoted) comment.downvotedBy.push(req.user._id);

  comment.upvotes = comment.upvotedBy.length;
  comment.downvotes = comment.downvotedBy.length;
  await comment.save();

  res.json({ comment });
});