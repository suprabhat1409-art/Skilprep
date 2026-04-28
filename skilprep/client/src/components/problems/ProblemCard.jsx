import { Link } from 'react-router-dom';
import DifficultyBadge from '../common/DifficultyBadge';

export default function ProblemCard({ problem }) {
  const field = problem.field;

  return (
    <Link
      to={`/problems/${problem.slug}`}
      className="block bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all p-4 no-underline"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {problem.userStatus === 'solved' && (
              <span className="text-green-500 text-sm">&#10003;</span>
            )}
            <h3 className="text-sm font-semibold text-gray-900 truncate">{problem.title}</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {field && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: field.color + '20', color: field.color }}
              >
                {field.name}
              </span>
            )}
            <DifficultyBadge difficulty={problem.difficulty} />
            {problem.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs text-gray-400">{problem.solveCount || 0} solved</span>
        </div>
      </div>
    </Link>
  );
}
