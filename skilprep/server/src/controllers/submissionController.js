const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const Field = require('../models/Field');
const TestCase = require('../models/TestCase');
const EvaluatorRegistry = require('../evaluators/EvaluatorRegistry');
const { evaluateCodeProblem } = require('../services/codeExecutionService');
const { updateUserStats } = require('../services/streakService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.createSubmission = asyncHandler(async (req, res) => {
  const { problemId, answer } = req.body;
  if (!problemId || !answer) throw new ApiError(400, 'problemId and answer are required');

  const problem = await Problem.findById(problemId).populate('field');
  if (!problem) throw new ApiError(404, 'Problem not found');

  const field = problem.field;

  // Check if already solved (don't award duplicate points)
  const alreadySolved = await Submission.findOne({
    user: req.user._id,
    problem: problemId,
    status: 'accepted',
  });

  const submission = await Submission.create({
    user: req.user._id,
    problem: problemId,
    field: field._id,
    answer,
    kind: 'submission',
    status: 'pending',
  });

  if (field.solverType === 'code') {
    const codeResult = await evaluateCodeProblem({
      problem,
      language: answer.language,
      code: answer.code,
    });

    submission.status = codeResult.status;
    submission.score = codeResult.score;
    submission.testResults = codeResult.testResults;
    submission.executionTimeMs = codeResult.executionTimeMs;
    await submission.save();

    if (codeResult.status === 'accepted' && !alreadySolved) {
      await updateUserStats(req.user._id, field, problem);
      await Problem.findByIdAndUpdate(problemId, { $inc: { solveCount: 1, attemptCount: 1 } });
    } else {
      await Problem.findByIdAndUpdate(problemId, { $inc: { attemptCount: 1 } });
    }

    return res.json({
      submission: {
        _id: submission._id,
        status: submission.status,
        score: submission.score,
        testResults: submission.testResults,
        executionTimeMs: submission.executionTimeMs,
      },
      details: codeResult.details || {},
    });
  }

  // For non-code problems, evaluate synchronously
  const evaluator = EvaluatorRegistry.getEvaluator(field.solverType);
  const result = await evaluator.evaluate(answer, problem, field);

  submission.status = result.status;
  submission.score = result.score;
  await submission.save();

  if (result.status === 'accepted' && !alreadySolved) {
    await updateUserStats(req.user._id, field, problem);
    await Problem.findByIdAndUpdate(problemId, { $inc: { solveCount: 1, attemptCount: 1 } });
  } else {
    await Problem.findByIdAndUpdate(problemId, { $inc: { attemptCount: 1 } });
  }

  res.json({
    submission: {
      _id: submission._id,
      status: submission.status,
      score: submission.score,
    },
    details: result.details || {},
  });
});

exports.getSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);
  if (!submission) throw new ApiError(404, 'Submission not found');
  res.json({ submission });
});

exports.getMySubmissionsForProblem = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({
    user: req.user._id,
    problem: req.params.problemId,
  }).sort({ createdAt: -1 }).limit(20);
  res.json({ submissions });
});

exports.runCode = asyncHandler(async (req, res) => {
  const { problemId, language, code } = req.body;
  if (!problemId || !language || !code) throw new ApiError(400, 'problemId, language and code are required');

  const problem = await Problem.findById(problemId).populate('field');
  if (!problem) throw new ApiError(404, 'Problem not found');
  if (problem.field.solverType !== 'code') throw new ApiError(400, 'Code execution is only available for coding problems');

  const result = await evaluateCodeProblem({ problem, language, code });
  await Submission.create({
    user: req.user._id,
    problem: problem._id,
    field: problem.field._id,
    answer: { language, code },
    kind: 'run',
    status: result.status,
    score: result.score,
    testResults: result.testResults,
    executionTimeMs: result.executionTimeMs,
  });
  res.json(result);
});
