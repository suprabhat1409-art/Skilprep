import { useState } from 'react';

export default function ShortAnswerSolver({ problem, onSubmit, submitting }) {
  const [textAnswer, setTextAnswer] = useState('');

  return (
    <div className="space-y-4">
      <textarea
        rows={4}
        value={textAnswer}
        onChange={(e) => setTextAnswer(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

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