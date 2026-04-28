const Problem = require('../models/Problem');
const TestCase = require('../models/TestCase');
const ApiError = require('../utils/ApiError');
const { executeCode } = require('../sandbox/processSandbox');

const normalize = (value) => String(value ?? '').replace(/\r\n/g, '\n').trim();

async function evaluateCodeProblem({ problem, language, code, timeoutMs }) {
  const fullProblem = problem?.field ? problem : await Problem.findById(problem._id).populate('field');
  if (!fullProblem) throw new ApiError(404, 'Problem not found');

  const testCases = await TestCase.find({ problem: fullProblem._id }).sort({ sortOrder: 1 });
  if (testCases.length === 0) throw new ApiError(400, 'No test cases available');

  const testResults = [];
  let passedCount = 0;
  let totalExecutionTime = 0;

  for (const testCase of testCases) {
    const runResult = await executeCode({
      language,
      code,
      input: testCase.input,
      timeoutMs: timeoutMs || fullProblem.field?.config?.timeoutMs || 5000,
    });

    totalExecutionTime += runResult.executionTimeMs || 0;

    if (runResult.compileError) {
      testResults.push({
        testCaseId: testCase._id,
        passed: false,
        actualOutput: '',
        executionTimeMs: runResult.executionTimeMs || 0,
        memoryUsedKb: 0,
        error: runResult.stderr || 'Compilation failed',
      });
      return {
        status: 'compile_error',
        score: 0,
        testResults,
        executionTimeMs: totalExecutionTime,
        details: { message: runResult.stderr || 'Compilation failed' },
      };
    }

    if (runResult.timedOut) {
      testResults.push({
        testCaseId: testCase._id,
        passed: false,
        actualOutput: normalize(runResult.stdout),
        executionTimeMs: runResult.executionTimeMs || 0,
        memoryUsedKb: 0,
        error: 'Time limit exceeded',
      });
      return {
        status: 'time_limit',
        score: 0,
        testResults,
        executionTimeMs: totalExecutionTime,
        details: { message: 'Time limit exceeded' },
      };
    }

    if (runResult.exitCode !== 0) {
      testResults.push({
        testCaseId: testCase._id,
        passed: false,
        actualOutput: normalize(runResult.stdout),
        executionTimeMs: runResult.executionTimeMs || 0,
        memoryUsedKb: 0,
        error: runResult.stderr || 'Runtime error',
      });
      return {
        status: 'runtime_error',
        score: 0,
        testResults,
        executionTimeMs: totalExecutionTime,
        details: { message: runResult.stderr || 'Runtime error' },
      };
    }

    const actualOutput = normalize(runResult.stdout);
    const expectedOutput = normalize(testCase.expectedOutput);
    const passed = actualOutput === expectedOutput;
    if (passed) passedCount += 1;

    testResults.push({
      testCaseId: testCase._id,
      passed,
      actualOutput,
      executionTimeMs: runResult.executionTimeMs || 0,
      memoryUsedKb: 0,
      error: passed ? '' : 'Wrong answer',
    });
  }

  const allPassed = passedCount === testCases.length;
  const score = allPassed ? fullProblem.baseScore : Math.max(0, Math.round((fullProblem.baseScore * passedCount) / testCases.length));

  return {
    status: allPassed ? 'accepted' : 'wrong_answer',
    score,
    testResults,
    executionTimeMs: totalExecutionTime,
    details: {
      passedCount,
      totalTests: testCases.length,
      message: allPassed ? 'All tests passed' : `${passedCount}/${testCases.length} tests passed`,
    },
  };
}

module.exports = { evaluateCodeProblem };