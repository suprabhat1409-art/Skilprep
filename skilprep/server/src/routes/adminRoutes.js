const router = require('express').Router();
const User = require('../models/User');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const Field = require('../models/Field');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/summary', verifyToken, requireAdmin, async (req, res, next) => {
	try {
		const [users, problems, submissions, fields] = await Promise.all([
			User.countDocuments(),
			Problem.countDocuments(),
			Submission.countDocuments(),
			Field.countDocuments(),
		]);

		const topProblems = await Problem.find().sort({ solveCount: -1, attemptCount: -1 }).limit(5).populate('field', 'name slug color');

		res.json({
			summary: { users, problems, submissions, fields },
			topProblems,
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
