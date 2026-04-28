import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '../api/leaderboardApi';
import { getFields } from '../api/fieldApi';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function LeaderboardPage() {
  const { data: fieldsData } = useQuery({ queryKey: ['fields'], queryFn: getFields });
  const { data, isLoading } = useQuery({ queryKey: ['leaderboard'], queryFn: () => getLeaderboard() });

  const entries = data?.entries || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-600 mt-2">Top solvers across all fields.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top users</h2>
          {isLoading ? <LoadingSpinner /> : (
            <div className="space-y-3">
              {entries.slice(0, 10).map((entry) => (
                <div key={entry.username} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                  <div>
                    <div className="font-medium text-gray-900">#{entry.rank} {entry.username}</div>
                    <div className="text-sm text-gray-500">Solved {entry.totalSolved} · Streak {entry.currentStreak}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-indigo-600">{entry.totalScore} pts</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Field breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(fieldsData?.fields || []).map((field) => (
              <div key={field.slug} className="rounded-lg border border-gray-200 p-4">
                <div className="text-sm font-semibold text-gray-900">{field.name}</div>
                <div className="text-xs text-gray-500 mt-1">Solver type: {field.solverType}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}