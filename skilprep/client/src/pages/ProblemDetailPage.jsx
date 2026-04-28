import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';
import { getProblemBySlug } from '../api/problemApi';
import { getMySubmissions, runCode, submitSolution } from '../api/submissionApi';
import { createProblemComment, getProblemComments, voteComment } from '../api/commentApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DifficultyBadge from '../components/common/DifficultyBadge';
import McqSolver from '../components/solvers/McqSolver';
import MathSolver from '../components/solvers/MathSolver';
import ShortAnswerSolver from '../components/solvers/ShortAnswerSolver';
import CodeSolver from '../components/solvers/CodeSolver';
import CommentForm from '../components/discussion/CommentForm';
import CommentItem from '../components/discussion/CommentItem';

function solverFor(type) {
  if (type === 'code') return CodeSolver;
  if (type === 'math') return MathSolver;
  if (type === 'mcq') return McqSolver;
  return ShortAnswerSolver;
}

export default function ProblemDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [result, setResult] = useState(null);
  const [runResult, setRunResult] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['problem', slug],
    queryFn: () => getProblemBySlug(slug),
  });

  const problem = data?.problem;
  const solverType = problem?.field?.solverType || 'short_answer';
  const Solver = useMemo(() => solverFor(solverType), [solverType]);

  const submissionsQuery = useQuery({
    queryKey: ['problem-submissions', problem?._id],
    queryFn: () => getMySubmissions(problem._id),
    enabled: !!problem && !!user,
  });

  const commentsQuery = useQuery({
    queryKey: ['problem-comments', problem?._id],
    queryFn: () => getProblemComments(problem._id),
    enabled: !!problem,
  });

  const submitMutation = useMutation({
    mutationFn: (answer) => submitSolution({ problemId: problem._id, answer }),
    onSuccess: (response) => {
      setResult(response);
      toast.success('Submission saved');
      queryClient.invalidateQueries({ queryKey: ['problem-submissions', problem._id] });
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || 'Submission failed');
    },
  });

  const runMutation = useMutation({
    mutationFn: (answer) => runCode({ problemId: problem._id, ...answer }),
    onSuccess: (response) => {
      setRunResult(response);
      toast.success('Code executed');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || 'Code execution failed');
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ body, parentComment }) => createProblemComment(problem._id, { body, parentComment }),
    onSuccess: () => {
      setReplyTo(null);
      queryClient.invalidateQueries({ queryKey: ['problem-comments', problem._id] });
      toast.success('Comment posted');
    },
    onError: (err) => toast.error(err.response?.data?.error?.message || 'Could not post comment'),
  });

  const voteMutation = useMutation({
    mutationFn: ({ commentId, direction }) => voteComment(commentId, direction),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['problem-comments', problem._id] }),
    onError: (err) => toast.error(err.response?.data?.error?.message || 'Vote failed'),
  });

  const handleSubmit = (answer) => {
    if (!user) {
      toast.error('Please login to submit an answer');
      return;
    }
    submitMutation.mutate(answer);
  };

  const handleRun = (answer) => {
    if (!user) {
      toast.error('Please login to run code');
      return;
    }
    runMutation.mutate(answer);
  };

  const buildCommentTree = (flatComments) => {
    const byId = new Map();
    const roots = [];

    flatComments.forEach((comment) => byId.set(comment._id, { ...comment, replies: [] }));
    byId.forEach((comment) => {
      if (comment.parentComment) {
        const parent = byId.get(comment.parentComment);
        if (parent) parent.replies.push(comment);
        else roots.push(comment);
      } else {
        roots.push(comment);
      }
    });

    return roots;
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">Problem not found.</div>;
  }

  const field = problem.field;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
      <section className="space-y-4">
        <Link to="/problems" className="text-sm text-indigo-600 hover:text-indigo-800 no-underline">&larr; Back to problems</Link>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{problem.title}</h1>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: `${field.color}20`, color: field.color }}
            >
              {field.name}
            </span>
            {problem.tags?.map((tag) => (
              <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{tag}</span>
            ))}
          </div>

          <article className="prose prose-slate max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.description}</ReactMarkdown>
          </article>

          {problem.sampleTests?.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Sample Tests</h2>
              <div className="space-y-3">
                {problem.sampleTests.map((sample, index) => (
                  <div key={sample._id || index} className="rounded-md bg-white p-3 border border-gray-200 text-sm">
                    <div className="font-medium text-gray-700 mb-1">Input</div>
                    <pre className="whitespace-pre-wrap text-gray-800 mb-2">{sample.input || '(no input)'}</pre>
                    <div className="font-medium text-gray-700 mb-1">Expected Output</div>
                    <pre className="whitespace-pre-wrap text-gray-800">{sample.expectedOutput}</pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <aside className="space-y-4 sticky top-24">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Solve</h2>
          <Solver
            problem={problem}
            onSubmit={handleSubmit}
            onRun={solverType === 'code' ? handleRun : undefined}
            submitting={submitMutation.isPending}
            running={runMutation.isPending}
          />
          {result?.submission && (
            <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${result.submission.status === 'accepted' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
              <div className="font-semibold">{result.submission.status === 'accepted' ? 'Accepted' : 'Submitted'}</div>
              <div>Score: {result.submission.score ?? 0}</div>
              {result.details?.message && <div className="mt-1">{result.details.message}</div>}
            </div>
          )}

          {runResult && !result?.submission && (
            <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${runResult.status === 'accepted' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
              <div className="font-semibold">{runResult.status === 'accepted' ? 'All tests passed' : 'Run completed'}</div>
              <div>{runResult.details?.message}</div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Your recent attempts</h3>
          {user ? (
            submissionsQuery.isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-2 text-sm">
                {(submissionsQuery.data?.submissions || []).map((submission) => (
                  <div key={submission._id} className="rounded-md border border-gray-200 px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-gray-800 capitalize">{submission.status}</span>
                      <span className="text-gray-500 capitalize">{submission.kind || 'submission'} · Score {submission.score ?? 0}</span>
                    </div>
                  </div>
                ))}
                {(submissionsQuery.data?.submissions || []).length === 0 && <div className="text-gray-500">No submissions yet.</div>}
              </div>
            )
          ) : (
            <div className="text-sm text-gray-500">Login to save attempts and see your history.</div>
          )}
        </div>
      </aside>

      <section className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Discussion</h2>
            <p className="text-sm text-gray-500 mt-1">Ask questions, share ideas, and help others solve this problem.</p>
          </div>
          {replyTo && (
            <button type="button" onClick={() => setReplyTo(null)} className="text-sm text-indigo-600 hover:text-indigo-800">
              Cancel reply to {replyTo.author?.username}
            </button>
          )}
        </div>

        {user ? (
          <div className="space-y-4">
            <CommentForm
              onSubmit={(body) => commentMutation.mutate({ body, parentComment: replyTo?._id || null })}
              submitting={commentMutation.isPending}
              placeholder={replyTo ? `Reply to ${replyTo.author?.username}...` : 'Write a comment or ask a question...'}
              buttonLabel={replyTo ? 'Post reply' : 'Post comment'}
            />

            <div className="space-y-4">
              {(commentsQuery.data?.comments?.length || 0) > 0 ? (
                buildCommentTree(commentsQuery.data.comments).map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    onReply={(target) => setReplyTo(target)}
                    onVote={(commentId, direction) => voteMutation.mutate({ commentId, direction })}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500">No comments yet. Be the first to start the discussion.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Login to join the discussion.</div>
        )}
      </section>
    </div>
  );
}