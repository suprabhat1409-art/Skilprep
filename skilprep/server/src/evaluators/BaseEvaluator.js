class BaseEvaluator {
  async evaluate(answer, problem, field) {
    throw new Error('evaluate() must be implemented by subclass');
  }
}

module.exports = BaseEvaluator;
