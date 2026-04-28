const BaseEvaluator = require('./BaseEvaluator');

class ShortAnswerEvaluator extends BaseEvaluator {
  async evaluate(answer, problem) {
    const userAnswer = (answer.textAnswer || '').trim();
    const content = problem.content;
    const caseSensitive = content.caseSensitive || false;
    const acceptable = content.acceptableAnswers || [];

    const normalize = (s) => {
      s = s.trim();
      if (!caseSensitive) s = s.toLowerCase();
      return s;
    };

    const normalizedUser = normalize(userAnswer);
    const isCorrect = acceptable.some((a) => normalize(a) === normalizedUser);

    return {
      status: isCorrect ? 'accepted' : 'wrong_answer',
      score: isCorrect ? problem.baseScore : 0,
      details: {
        correct: isCorrect,
        explanation: content.explanation || '',
      },
    };
  }
}

module.exports = ShortAnswerEvaluator;
