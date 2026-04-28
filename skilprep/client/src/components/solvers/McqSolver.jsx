import { useMemo, useState } from 'react';

export default function McqSolver({ problem, onSubmit, submitting }) {
  const choices = problem?.content?.choices || [];
  const allowMultiple = (problem?.content?.correctChoices || []).length > 1;
  const [selected, setSelected] = useState([]);

  const toggle = (index) => {
    setSelected((current) => {
      if (allowMultiple) {
        return current.includes(index) ? current.filter((item) => item !== index) : [...current, index];
      }
      return [index];
    });
  };

  const canSubmit = selected.length > 0;

  const selectedLabels = useMemo(() => selected.map((index) => choices[index]?.label).filter(Boolean), [choices, selected]);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {choices.map((choice, index) => (
          <button
            key={choice.label + index}
            type="button"
            onClick={() => toggle(index)}
            className={`w-full text-left border rounded-lg px-4 py-3 transition-colors ${selected.includes(index) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
          >
            <div className="flex items-start gap-3">
              <span className="font-semibold text-gray-700 w-6">{choice.label}</span>
              <span className="text-gray-800">{choice.text}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onSubmit({ selectedChoices: selected, selectedLabels })}
        disabled={!canSubmit || submitting}
        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
      >
        {submitting ? 'Submitting...' : 'Submit Answer'}
      </button>
    </div>
  );
}