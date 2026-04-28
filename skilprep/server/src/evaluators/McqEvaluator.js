const BaseEvaluator = require('./BaseEvaluator');

class McqEvaluator extends BaseEvaluator {
  async evaluate(answer, problem) {
    const correct = problem.content.correctChoices || [];
    const selected = answer.selectedChoices || [];

    const isCorrect =
      correct.length === selected.length &&
      correct.every((c) => selected.includes(c));

    return {
      status: isCorrect ? 'accepted' : 'wrong_answer',
      score: isCorrect ? problem.baseScore : 0,
      details: {
        correct: isCorrect,
        explanation: problem.content.explanation || '',
      },
    };
  }
}

module.exports = McqEvaluator;
