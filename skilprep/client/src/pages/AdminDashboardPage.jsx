import { useQuery } from '@tanstack/react-query';
import { getAdminSummary } from '../api/adminApi';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['admin-summary'], queryFn: getAdminSummary });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">Admin summary unavailable. Login as an admin to view it.</div>;

  const summary = data.summary;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Basic platform summary and top problems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          ['Users', summary.users],
          ['Problems', summary.problems],
          ['Submissions', summary.submissions],
          ['Fields', summary.fields],
        ].map(([label, value]) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top problems</h2>
        <div className="space-y-3">
          {data.topProblems.map((problem) => (
            <div key={problem._id} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <div>
                <div className="font-medium text-gray-900">{problem.title}</div>
                <div className="text-sm text-gray-500">{problem.field?.name || 'Unassigned field'}</div>
              </div>
              <div className="text-sm text-gray-500">Solved {problem.solveCount || 0} · Attempts {problem.attemptCount || 0}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}