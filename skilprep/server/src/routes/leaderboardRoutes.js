const router = require('express').Router();
const User = require('../models/User');

async function buildLeaderboard(fieldSlug = null) {
	const users = await User.find({ role: { $in: ['user', 'admin'] } }).sort({ 'stats.totalScore': -1, 'stats.totalSolved': -1, createdAt: 1 });

	return users.map((user, index) => {
		const fieldStats = fieldSlug ? user.stats.byField?.get(fieldSlug) || { solved: 0, score: 0 } : null;

		return {
			rank: index + 1,
			username: user.username,
			avatar: user.avatar,
			bio: user.bio,
			totalSolved: user.stats.totalSolved,
			totalScore: user.stats.totalScore,
			currentStreak: user.stats.currentStreak,
			longestStreak: user.stats.longestStreak,
			fieldSolved: fieldStats?.solved || 0,
			fieldScore: fieldStats?.score || 0,
		};
	});
}

router.get('/', async (req, res, next) => {
	try {
		const entries = await buildLeaderboard(req.query.field || null);
		res.json({ entries, field: req.query.field || null });
	} catch (error) {
		next(error);
	}
});

router.get('/:fieldSlug', async (req, res, next) => {
	try {
		const entries = await buildLeaderboard(req.params.fieldSlug);
		res.json({ entries, field: req.params.fieldSlug });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
