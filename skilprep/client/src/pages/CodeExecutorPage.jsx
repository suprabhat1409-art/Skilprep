import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { getProblems } from '../api/problemApi';
import { getMySubmissions, runCode } from '../api/submissionApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LANGS = ['python', 'javascript', 'cpp', 'java'];

const SIDEBAR_PANEL_CLASS = 'premium-shell p-4 md:p-5';
const PANEL_TITLE_CLASS = 'text-sm font-semibold text-slate-900';
const MUTED_TEXT_CLASS = 'text-sm text-slate-500';
const SELECT_CLASS = 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800';

export default function CodeExecutorPage() {
  const { user } = useAuth();
  const [problemId, setProblemId] = useState('');
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('print("Hello SkilPrep")');

  const { data, isLoading } = useQuery({
    queryKey: ['executor-coding-problems'],
    queryFn: () => getProblems({ field: 'coding', limit: 100, page: 1, sort: 'newest' }),
  });

  const problems = data?.problems || [];

  const selectedProblem = useMemo(
    () => problems.find((problem) => problem._id === problemId) || null,
    [problems, problemId]
  );

  const historyQuery = useQuery({
    queryKey: ['executor-history', problemId],
    queryFn: () => getMySubmissions(problemId),
    enabled: !!user && !!problemId,
  });

  const runMutation = useMutation({
    mutationFn: () => runCode({ problemId, language, code }),
    onSuccess: async () => {
      await historyQuery.refetch();
      toast.success('Code executed and saved to history');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || 'Could not run code');
    },
  });

  return (
    <div className="space-y-7 reveal-up">
      <div className="premium-shell p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-teal-700 font-semibold">Lab</p>
            <h1 className="premium-heading text-3xl md:text-4xl font-bold mt-2 text-slate-900">Code Executor</h1>
            <p className="text-slate-600 mt-3 max-w-xl">Choose a coding challenge, test your implementation, and inspect pass/fail behavior instantly.</p>
          </div>
          <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
            Sandbox mode: process-based
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          <div className="premium-shell overflow-hidden">
            <div className="px-4 py-4 md:px-5 border-b border-slate-200 flex items-center gap-3 flex-wrap bg-slate-50/70">
              <label className="text-xs uppercase tracking-[0.14em] font-semibold text-slate-600">Language</label>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className={SELECT_CLASS}
              >
                {LANGS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <Editor
              height="480px"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
            />
          </div>

          <div className="space-y-4">
            <div className={SIDEBAR_PANEL_CLASS}>
              <label className="text-xs uppercase tracking-[0.14em] font-semibold text-slate-600">Coding Problem</label>
              <select
                value={problemId}
                onChange={(event) => setProblemId(event.target.value)}
                className={`mt-2 w-full ${SELECT_CLASS}`}
              >
                <option value="">Select a problem</option>
                {problems.map((problem) => (
                  <option key={problem._id} value={problem._id}>{problem.title}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => runMutation.mutate()}
                disabled={!problemId || !code.trim() || runMutation.isPending}
                className="mt-4 w-full rounded-lg bg-teal-700 hover:bg-teal-800 text-white px-4 py-2.5 font-semibold disabled:opacity-60"
              >
                {runMutation.isPending ? 'Running...' : 'Run in VS Code'}
              </button>
              <p className="mt-2 text-xs text-slate-500">Every run is saved automatically to your history for this problem.</p>
            </div>

            <div className={SIDEBAR_PANEL_CLASS}>
              <h2 className={`${PANEL_TITLE_CLASS} mb-2`}>Result</h2>
              {!runMutation.data && <p className={MUTED_TEXT_CLASS}>Run your code to see test results.</p>}

              {runMutation.data && (
                <div className="space-y-3 text-sm">
                  <div className="font-semibold text-slate-800 capitalize">Status: {runMutation.data.status}</div>
                  <div className="text-slate-600">{runMutation.data.details?.message}</div>
                  <div className="text-slate-600">Execution Time: {runMutation.data.executionTimeMs || 0} ms</div>

                  <div className="space-y-2">
                    {(runMutation.data.testResults || []).map((item, index) => (
                      <div key={item.testCaseId || index} className={`rounded-md px-3 py-2 border ${item.passed ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        Test {index + 1}: {item.passed ? 'Passed' : 'Failed'}
                        {item.error ? ` (${item.error})` : ''}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedProblem && (
              <div className={SIDEBAR_PANEL_CLASS}>
                <h2 className={`${PANEL_TITLE_CLASS} mb-2`}>Selected Problem</h2>
                <p className="text-sm text-slate-700">{selectedProblem.title}</p>
              </div>
            )}

            {problemId && (
              <div className={SIDEBAR_PANEL_CLASS}>
                <h2 className={`${PANEL_TITLE_CLASS} mb-3`}>Run History</h2>
                {!user ? (
                  <p className={MUTED_TEXT_CLASS}>Login to save and view your run history.</p>
                ) : historyQuery.isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="space-y-2 text-sm">
                    {(historyQuery.data?.submissions || []).slice(0, 5).map((submission) => (
                      <div key={submission._id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-slate-800 capitalize">{submission.status}</span>
                          <span className="text-xs uppercase tracking-[0.12em] text-slate-500">{submission.kind || 'submission'}</span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {new Date(submission.createdAt).toLocaleString()} · {submission.executionTimeMs || 0} ms
                        </div>
                      </div>
                    ))}
                    {(historyQuery.data?.submissions || []).length === 0 && <div className="text-slate-500">No saved runs yet.</div>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}