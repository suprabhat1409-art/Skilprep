import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api/userApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => getUserProfile(username),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">Profile not found.</div>;

  const profile = data.user;
  const isMe = currentUser?.username === profile.username;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{profile.username}</h1>
            <p className="text-gray-600 mt-1">{profile.bio || 'No bio yet.'}</p>
            {isMe && <div className="mt-2 text-sm text-indigo-600 font-medium">This is your profile</div>}
          </div>
          <div className="text-right text-sm text-gray-500">
            <div>Role: {profile.role}</div>
            <div>Joined: {new Date(profile.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          ['Solved', profile.stats.totalSolved],
          ['Score', profile.stats.totalScore],
          ['Current streak', profile.stats.currentStreak],
          ['Longest streak', profile.stats.longestStreak],
        ].map(([label, value]) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent submissions</h2>
        <div className="space-y-3">
          {data.recentSubmissions.map((submission) => (
            <div key={submission._id} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <div>
                <Link to={`/problems/${submission.problem.slug}`} className="font-medium text-gray-900 no-underline hover:text-indigo-600">
                  {submission.problem.title}
                </Link>
                <div className="text-sm text-gray-500">{submission.field?.name || 'Unknown field'}</div>
              </div>
              <div className="text-right text-sm">
                <div className="font-medium capitalize text-gray-900">{submission.status}</div>
                <div className="text-gray-500 capitalize">{submission.kind || 'submission'}</div>
                <div className="text-gray-500">Score {submission.score ?? 0}</div>
              </div>
            </div>
          ))}
          {data.recentSubmissions.length === 0 && <div className="text-gray-500">No submissions yet.</div>}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Field progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.fieldBreakdown.map((entry) => (
            <div key={entry.slug} className="rounded-lg border border-gray-200 p-4">
              <div className="font-medium text-gray-900">{entry.slug}</div>
              <div className="text-sm text-gray-500">Solved {entry.solved || 0} · Score {entry.score || 0}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}