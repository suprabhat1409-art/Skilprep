const router = require('express').Router();
const User = require('../models/User');
const Submission = require('../models/Submission');
const { optionalAuth, verifyToken } = require('../middleware/authMiddleware');
const ApiError = require('../utils/ApiError');

router.get('/me', verifyToken, async (req, res) => {
	res.json({ user: req.user.toPublicJSON() });
});

router.get('/:username', optionalAuth, async (req, res, next) => {
	try {
		const user = await User.findOne({ username: req.params.username }).select('-passwordHash');
		if (!user) throw new ApiError(404, 'User not found');

		const recentSubmissions = await Submission.find({ user: user._id })
			.populate('problem', 'title slug')
			.populate('field', 'name slug color')
			.sort({ createdAt: -1 })
			.limit(10);

		res.json({
			user: user.toPublicJSON(),
			recentSubmissions,
			fieldBreakdown: Array.from(user.stats.byField?.entries?.() || []).map(([slug, stats]) => ({ slug, ...stats })),
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
