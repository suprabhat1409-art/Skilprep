import { useState } from 'react';

export default function MathSolver({ problem, onSubmit, submitting }) {
  const [textAnswer, setTextAnswer] = useState('');

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={textAnswer}
        onChange={(e) => setTextAnswer(e.target.value)}
        placeholder="Enter your answer"
        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <p className="text-sm text-gray-500">
        {problem?.content?.answerType === 'expression' ? 'You can enter math expressions like 3x^2.' : 'Numeric answers are compared with the configured tolerance.'}
      </p>

      <button
        type="button"
        onClick={() => onSubmit({ textAnswer })}
        disabled={!textAnswer.trim() || submitting}
        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
      >
        {submitting ? 'Submitting...' : 'Submit Answer'}
      </button>
    </div>
  );
}