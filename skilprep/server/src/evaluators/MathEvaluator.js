const BaseEvaluator = require('./BaseEvaluator');

class MathEvaluator extends BaseEvaluator {
  async evaluate(answer, problem, field) {
    const userAnswer = (answer.textAnswer || '').trim();
    const content = problem.content;
    const tolerance = field?.config?.tolerance || 0.001;

    if (content.answerType === 'numeric') {
      const expected = parseFloat(content.correctAnswer);
      const actual = parseFloat(userAnswer);
      if (isNaN(actual)) {
        return { status: 'wrong_answer', score: 0, details: { message: 'Not a valid number' } };
      }
      const isCorrect = Math.abs(expected - actual) <= tolerance;
      return {
        status: isCorrect ? 'accepted' : 'wrong_answer',
        score: isCorrect ? problem.baseScore : 0,
        details: { explanation: content.hints?.[content.hints.length - 1] || '' },
      };
    }

    // expression or symbolic — check against acceptable answers
    const acceptable = [content.correctAnswer, ...(content.acceptableAnswers || [])];
    const normalized = userAnswer.replace(/\s+/g, '').toLowerCase();
    const isCorrect = acceptable.some(
      (a) => a.replace(/\s+/g, '').toLowerCase() === normalized
    );

    return {
      status: isCorrect ? 'accepted' : 'wrong_answer',
      score: isCorrect ? problem.baseScore : 0,
      details: { explanation: content.hints?.[content.hints.length - 1] || '' },
    };
  }
}

module.exports = MathEvaluator;
