import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { getProblems } from '../api/problemApi';
import { runCode } from '../api/submissionApi';
import { getLeaderboard } from '../api/leaderboardApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TRACKS = [
  { title: 'Coding Foundations', field: 'coding' },
  { title: 'Math Mastery', field: 'math' },
  { title: 'Science Sprint', field: 'science' },
  { title: 'Logic and Puzzles', field: 'logic' },
];

const LANGS = ['python', 'javascript', 'cpp', 'java'];

const PANEL_CLASS = 'premium-shell p-5 md:p-6 space-y-4';
const SELECT_CLASS = 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm';
const LINK_CARD_CLASS = 'rounded-lg border border-slate-200 bg-white px-4 py-3 no-underline hover:border-teal-300';

export default function WorkspacePage() {
  const { user } = useAuth();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('print("Hello SkilPrep")');
  const [problemId, setProblemId] = useState('');

  const problemsQuery = useQuery({
    queryKey: ['workspace-problems'],
    queryFn: () => getProblems({ limit: 8, page: 1, sort: 'popular' }),
  });

  const codingQuery = useQuery({
    queryKey: ['workspace-coding-problems'],
    queryFn: () => getProblems({ field: 'coding', limit: 30, page: 1, sort: 'popular' }),
  });

  const leaderboardQuery = useQuery({
    queryKey: ['workspace-leaderboard'],
    queryFn: () => getLeaderboard(),
  });

  const selectedProblem = useMemo(
    () => (codingQuery.data?.problems || []).find((item) => item._id === problemId) || null,
    [codingQuery.data, problemId]
  );

  const runMutation = useMutation({
    mutationFn: () => runCode({ problemId, language, code }),
    onError: (error) => toast.error(error.response?.data?.error?.message || 'Could not run code'),
  });

  return (
    <div className="space-y-7 reveal-up">
      <div className="premium-shell p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-teal-700 font-semibold">Unified</p>
        <h1 className="premium-heading text-3xl md:text-4xl font-bold mt-2 text-slate-900">All-in-One Workspace</h1>
        <p className="text-slate-600 mt-3 max-w-2xl">Everything in one place: learning tracks, practice problems, live code execution, and leaderboard snapshot.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 premium-shell p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="premium-heading text-xl font-semibold text-slate-900">Code Playground</h2>
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className={SELECT_CLASS}
              >
                {LANGS.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <select
                value={problemId}
                onChange={(event) => setProblemId(event.target.value)}
                className={`${SELECT_CLASS} min-w-[220px]`}
              >
                <option value="">Select coding problem</option>
                {(codingQuery.data?.problems || []).map((problem) => (
                  <option key={problem._id} value={problem._id}>{problem.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <Editor
              height="350px"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
            />
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm text-slate-600">{selectedProblem ? `Selected: ${selectedProblem.title}` : 'Choose a coding problem to run against real tests.'}</p>
            <button
              type="button"
              disabled={!user || !problemId || !code.trim() || runMutation.isPending}
              onClick={() => runMutation.mutate()}
              className="rounded-lg bg-teal-700 hover:bg-teal-800 text-white px-4 py-2.5 font-semibold disabled:opacity-60"
            >
              {runMutation.isPending ? 'Running...' : 'Run Code'}
            </button>
          </div>

          {!user && <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">Login is required to run code.</p>}

          {runMutation.data && (
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
              <div className="font-semibold text-slate-900 capitalize">Status: {runMutation.data.status}</div>
              <div className="text-slate-600 mt-1">{runMutation.data.details?.message}</div>
            </div>
          )}
        </section>

        <section className={PANEL_CLASS}>
          <h2 className="premium-heading text-xl font-semibold text-slate-900">Top Leaderboard</h2>
          {leaderboardQuery.isLoading ? <LoadingSpinner /> : (
            <div className="space-y-2">
              {(leaderboardQuery.data?.entries || []).slice(0, 6).map((entry) => (
                <div key={entry.username} className="rounded-lg border border-slate-200 bg-white px-3 py-2 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">#{entry.rank} {entry.username}</div>
                    <div className="text-xs text-slate-500">Solved {entry.totalSolved}</div>
                  </div>
                  <div className="text-sm font-semibold text-teal-700">{entry.totalScore}</div>
                </div>
              ))}
            </div>
          )}
          <Link to="/leaderboard" className="inline-flex text-sm font-medium text-blue-700 hover:text-blue-800 no-underline">Open full leaderboard</Link>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className={PANEL_CLASS}>
          <div className="flex items-center justify-between">
            <h2 className="premium-heading text-xl font-semibold text-slate-900">Learning Tracks</h2>
            <Link to="/learning-tracks" className="text-sm font-medium text-blue-700 hover:text-blue-800 no-underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TRACKS.map((track) => (
              <Link
                key={track.title}
                to={`/problems?field=${track.field}`}
                className={LINK_CARD_CLASS}
              >
                <div className="text-sm font-semibold text-slate-900">{track.title}</div>
                <div className="text-xs text-slate-500 mt-1">Start focused practice</div>
              </Link>
            ))}
          </div>
        </section>

        <section className={PANEL_CLASS}>
          <div className="flex items-center justify-between">
            <h2 className="premium-heading text-xl font-semibold text-slate-900">Popular Problems</h2>
            <Link to="/problems" className="text-sm font-medium text-blue-700 hover:text-blue-800 no-underline">Browse all</Link>
          </div>
          {problemsQuery.isLoading ? <LoadingSpinner /> : (
            <div className="space-y-2">
              {(problemsQuery.data?.problems || []).map((problem) => (
                <Link
                  key={problem._id}
                  to={`/problems/${problem.slug}`}
                  className={`block ${LINK_CARD_CLASS}`}
                >
                  <div className="text-sm font-semibold text-slate-900">{problem.title}</div>
                  <div className="text-xs text-slate-500 mt-1 capitalize">{problem.difficulty} · {problem.field?.name || 'General'}</div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}