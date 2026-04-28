import { Link } from 'react-router-dom';

const TRACKS = [
  {
    title: 'Coding Foundations',
    description: 'Start with arrays, strings, hash maps, and stack patterns.',
    level: 'Beginner',
    field: 'coding',
    sessions: 18,
    goal: 'Core DSA confidence',
    accent: 'from-sky-500/20 to-cyan-500/20',
  },
  {
    title: 'Math Mastery',
    description: 'Strengthen algebra, arithmetic progressions, and quick reasoning.',
    level: 'Beginner to Intermediate',
    field: 'math',
    sessions: 14,
    goal: 'Speed + accuracy',
    accent: 'from-emerald-500/20 to-lime-500/20',
  },
  {
    title: 'Science Sprint',
    description: 'Build confidence in physics, chemistry, and biology MCQs.',
    level: 'Intermediate',
    field: 'science',
    sessions: 16,
    goal: 'Concept recall',
    accent: 'from-blue-500/20 to-indigo-500/20',
  },
  {
    title: 'Logic and Puzzles',
    description: 'Train structured thinking with classic puzzle patterns.',
    level: 'All levels',
    field: 'logic',
    sessions: 12,
    goal: 'Reasoning depth',
    accent: 'from-amber-500/20 to-orange-500/20',
  },
  {
    title: 'General Knowledge Growth',
    description: 'Improve factual recall and contextual understanding.',
    level: 'All levels',
    field: 'general-knowledge',
    sessions: 10,
    goal: 'Breadth of knowledge',
    accent: 'from-rose-500/20 to-red-500/20',
  },
];

export default function LearningTracksPage() {
  return (
    <div className="space-y-7 reveal-up">
      <div className="premium-shell p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-700 font-semibold">Roadmaps</p>
        <h1 className="premium-heading text-3xl md:text-4xl font-bold mt-2 text-slate-900">Learning Tracks</h1>
        <p className="text-slate-600 mt-3 max-w-2xl">Pick a guided trajectory, build momentum with focused sessions, and track outcomes by discipline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {TRACKS.map((track) => (
          <div key={track.title} className="premium-shell p-5 md:p-6 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${track.accent} pointer-events-none`} />
            <div className="flex items-center justify-between gap-3">
              <h2 className="premium-heading text-xl font-semibold text-slate-900 relative">{track.title}</h2>
              <span className="text-xs rounded-full px-2 py-1 bg-white/80 border border-slate-200 text-slate-700 relative">{track.level}</span>
            </div>
            <p className="text-slate-600 mt-3 relative">{track.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 relative">
              <div className="rounded-lg bg-white/80 border border-slate-200 px-3 py-2">
                <div className="text-[11px] uppercase tracking-wider text-slate-500">Sessions</div>
                <div className="text-sm font-semibold text-slate-900">{track.sessions}</div>
              </div>
              <div className="rounded-lg bg-white/80 border border-slate-200 px-3 py-2">
                <div className="text-[11px] uppercase tracking-wider text-slate-500">Track Goal</div>
                <div className="text-sm font-semibold text-slate-900">{track.goal}</div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 relative">
              <Link
                to={`/problems?field=${track.field}`}
                className="inline-flex items-center rounded-lg bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 no-underline text-sm font-semibold"
              >
                Start Track
              </Link>
              <Link
                to="/problems"
                className="inline-flex items-center rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-slate-700 px-4 py-2 no-underline text-sm font-medium"
              >
                Browse All
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}