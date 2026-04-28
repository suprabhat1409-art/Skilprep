const User = require('../models/User');

async function updateUserStats(userId, field, problem) {
  const user = await User.findById(userId);
  if (!user) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastSolve = user.stats.lastSolveDate;
  let { currentStreak, longestStreak } = user.stats;

  if (lastSolve) {
    const last = new Date(lastSolve);
    last.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // same day, no streak change
    } else if (diffDays === 1) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }
  } else {
    currentStreak = 1;
  }

  if (currentStreak > longestStreak) longestStreak = currentStreak;

  const fieldSlug = field.slug;
  const byField = user.stats.byField || new Map();
  const fieldStats = byField.get(fieldSlug) || { solved: 0, score: 0 };
  fieldStats.solved += 1;
  fieldStats.score += problem.baseScore;
  byField.set(fieldSlug, fieldStats);

  user.stats.totalSolved += 1;
  user.stats.totalScore += problem.baseScore;
  user.stats.currentStreak = currentStreak;
  user.stats.longestStreak = longestStreak;
  user.stats.lastSolveDate = new Date();
  user.stats.byField = byField;

  await user.save();
}

module.exports = { updateUserStats };
