const Problem = require('../models/Problem');
const TestCase = require('../models/TestCase');
const Submission = require('../models/Submission');
const Field = require('../models/Field');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.getProblems = asyncHandler(async (req, res) => {
  const { field, difficulty, tags, search, sort, page = 1, limit = 20 } = req.query;
  const filter = { isPublished: true };

  if (field) {
    const f = await Field.findOne({ slug: field });
    if (f) filter.field = f._id;
  }
  if (difficulty) filter.difficulty = difficulty;
  if (tags) filter.tags = { $in: tags.split(',').map((t) => t.trim().toLowerCase()) };
  if (search) filter.title = { $regex: search, $options: 'i' };

  let sortObj = { createdAt: -1 };
  if (sort === 'oldest') sortObj = { createdAt: 1 };
  if (sort === 'popular') sortObj = { solveCount: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const [problems, total] = await Promise.all([
    Problem.find(filter).populate('field', 'slug name icon color solverType').sort(sortObj).skip(skip).limit(Number(limit)),
    Problem.countDocuments(filter),
  ]);

  let userSolved = new Set();
  if (req.user) {
    const accepted = await Submission.find({
      user: req.user._id,
      status: 'accepted',
      kind: 'submission',
      problem: { $in: problems.map((p) => p._id) },
    }).distinct('problem');
    userSolved = new Set(accepted.map((id) => id.toString()));
  }

  const problemsWithStatus = problems.map((p) => ({
    ...p.toObject(),
    userStatus: userSolved.has(p._id.toString()) ? 'solved' : 'unsolved',
  }));

  res.json({ problems: problemsWithStatus, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

exports.getProblemBySlug = asyncHandler(async (req, res) => {
  const problem = await Problem.findOne({ slug: req.params.slug, isPublished: true }).populate('field');
  if (!problem) throw new ApiError(404, 'Problem not found');

  let sampleTests = [];
  if (problem.field.solverType === 'code') {
    sampleTests = await TestCase.find({ problem: problem._id, isSample: true }).sort('sortOrder');
  }

  const result = { ...problem.toObject(), sampleTests };

  if (req.user) {
    const accepted = await Submission.findOne({ user: req.user._id, problem: problem._id, status: 'accepted', kind: 'submission' });
    result.userStatus = accepted ? 'solved' : 'unsolved';
  }

  res.json({ problem: result });
});

exports.createProblem = asyncHandler(async (req, res) => {
  req.body.authorId = req.user._id;
  const problem = await Problem.create(req.body);
  res.status(201).json({ problem });
});

exports.updateProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!problem) throw new ApiError(404, 'Problem not found');
  res.json({ problem });
});

exports.deleteProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findByIdAndUpdate(req.params.id, { isPublished: false }, { new: true });
  if (!problem) throw new ApiError(404, 'Problem not found');
  res.json({ message: 'Problem unpublished' });
});

exports.getTestCases = asyncHandler(async (req, res) => {
  const testCases = await TestCase.find({ problem: req.params.id }).sort('sortOrder');
  res.json({ testCases });
});

exports.createTestCase = asyncHandler(async (req, res) => {
  req.body.problem = req.params.id;
  const testCase = await TestCase.create(req.body);
  res.status(201).json({ testCase });
});

exports.updateTestCase = asyncHandler(async (req, res) => {
  const testCase = await TestCase.findByIdAndUpdate(req.params.tcId, req.body, { new: true, runValidators: true });
  if (!testCase) throw new ApiError(404, 'Test case not found');
  res.json({ testCase });
});

exports.deleteTestCase = asyncHandler(async (req, res) => {
  const testCase = await TestCase.findByIdAndDelete(req.params.tcId);
  if (!testCase) throw new ApiError(404, 'Test case not found');
  res.json({ message: 'Test case deleted' });
});
