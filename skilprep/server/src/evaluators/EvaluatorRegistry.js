const McqEvaluator = require('./McqEvaluator');
const MathEvaluator = require('./MathEvaluator');
const ShortAnswerEvaluator = require('./ShortAnswerEvaluator');

const evaluators = {
  mcq: new McqEvaluator(),
  math: new MathEvaluator(),
  short_answer: new ShortAnswerEvaluator(),
};

module.exports = {
  register(solverType, evaluator) {
    evaluators[solverType] = evaluator;
  },

  getEvaluator(solverType) {
    const evaluator = evaluators[solverType];
    if (!evaluator) throw new Error(`No evaluator for solver type: ${solverType}`);
    return evaluator;
  },

  hasEvaluator(solverType) {
    return solverType in evaluators;
  },
};
