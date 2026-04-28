import { useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';

const LANGUAGE_OPTIONS = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
];

export default function CodeSolver({ problem, onSubmit, onRun, submitting, running }) {
  const defaultLanguage = problem?.field?.config?.defaultLanguage || 'python';
  const [language, setLanguage] = useState(defaultLanguage);
  const starterCode = useMemo(() => problem?.content?.starterCode?.[language] || '', [language, problem]);
  const [code, setCode] = useState(starterCode);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm font-medium text-gray-700">Language</label>
        <select
          value={language}
          onChange={(e) => {
            const nextLanguage = e.target.value;
            setLanguage(nextLanguage);
            setCode(problem?.content?.starterCode?.[nextLanguage] || '');
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <Editor
          height="360px"
          language={language === 'cpp' ? 'cpp' : language}
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
        />
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        You can run your code against the problem tests before submitting.
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {onRun && (
          <button
            type="button"
            onClick={() => onRun({ language, code })}
            disabled={!code.trim() || running}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-60"
          >
            {running ? 'Running...' : 'Run'}
          </button>
        )}

        <button
          type="button"
          onClick={() => onSubmit({ language, code })}
          disabled={!code.trim() || submitting}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit Code'}
        </button>
      </div>
    </div>
  );
}