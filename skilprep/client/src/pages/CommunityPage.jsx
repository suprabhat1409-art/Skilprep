import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import NotificationsPanel from '../components/common/NotificationsPanel';
import CommunitySidebar from '../components/common/CommunitySidebar';
import {
  createCommunity,
  createCommunityResource,
  createCommunityTest,
  getCommunities,
  getCommunity,
  joinCommunity,
  reviewCommunitySubmission,
  submitCommunityTest,
  uploadCommunityResource,
  generateInvite,
  listInvites,
  joinWithCode,
} from '../api/communityApi';

const cardClass = 'rounded-2xl border border-slate-200 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur';

export default function CommunityPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedSlug, setSelectedSlug] = useState('');
  const [communityForm, setCommunityForm] = useState({ name: '', slug: '', description: '', isPublic: false });
  const [testForm, setTestForm] = useState({ title: '', description: '', prompt: '', dueAt: '' });
  const [resourceForm, setResourceForm] = useState({ kind: 'note', title: '', body: '', fileName: '', fileUrl: '' });
  const [uploadFile, setUploadFile] = useState(null);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [submissionDrafts, setSubmissionDrafts] = useState({});
  const [reviewDrafts, setReviewDrafts] = useState({});

  const communitiesQuery = useQuery({
    queryKey: ['communities'],
    queryFn: getCommunities,
  });

  const communities = communitiesQuery.data?.communities || [];

  useEffect(() => {
    if (!selectedSlug && communities.length > 0) {
      setSelectedSlug(communities[0].slug);
    }
  }, [communities, selectedSlug]);

  const communityQuery = useQuery({
    queryKey: ['community', selectedSlug],
    queryFn: () => getCommunity(selectedSlug),
    enabled: !!selectedSlug,
  });

  const community = communityQuery.data?.community;
  const tests = communityQuery.data?.tests || [];
  const resources = communityQuery.data?.resources || [];
  const submissions = communityQuery.data?.submissions || [];
  const viewer = communityQuery.data?.viewer || { canSeeAllResults: false, isMember: false };

  const visibleSubmissions = useMemo(() => {
    if (viewer.canSeeAllResults) return submissions;
    return submissions.filter((submission) => submission.user?._id === user?._id);
  }, [submissions, user?._id, viewer.canSeeAllResults]);

  const createCommunityMutation = useMutation({
    mutationFn: createCommunity,
    onSuccess: (data) => {
      toast.success('Community created');
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      setSelectedSlug(data.community.slug);
      setCommunityForm({ name: '', slug: '', description: '', isPublic: false });
    },
    onError: (error) => toast.error(error.response?.data?.error?.message || 'Could not create community'),
  });

  const joinMutation = useMutation({
    mutationFn: joinCommunity,
    onSuccess: () => {
      toast.success('Joined community');
      queryClient.invalidateQueries({ queryKey: ['community', selectedSlug] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
    onError: (error) => toast.error(error.response?.data?.error?.message || 'Could not join community'),
  });

  const createTestMutation = useMutation({
    mutationFn: (data) => createCommunityTest(community._id, data),
    onSuccess: () => {
      toast.success('Community test created');
      queryClient.invalidateQueries({ queryKey: ['community', selectedSlug] });
      setTestForm({ title: '', description: '', prompt: '', dueAt: '' });
    },
    onError: (error) => toast.error(error.response?.data?.error?.message || 'Could not create test'),
  });

  const createResourceMutation = useMutation({
    mutationFn: (data) => createCommunityResource(community._id, data),
    onSuccess: () => {
      toast.success('Shared to community');
      queryClient.invalidateQueries({ queryKey: ['community', selectedSlug] });
      setResourceForm({ kind: 'note', title: '', body: '', fileName: '', fileUrl: '' });
    },
    onError: (error) => toast.error(error.response?.data?.error?.message || 'Could not share resource'),
  });

  const uploadMutation = useMutation({
    mutationFn: (formData) => uploadCommunityResource(community._id, formData),
    onSuccess: () => {
      toast.success('File uploaded');
      queryClient.invalidateQueries({ queryKey: ['community', selectedSlug] });
      setUploadFile(null);
      setResourceForm({ kind: 'file', title: '', body: '', fileName: '', fileUrl: '' });
    },
    onError: (error) => toast.error(error.response?.data?.error?.message || 'Upload failed'),
  });

  const generateInviteMutation = useMutation({
    mutationFn: (data) => generateInvite(community._id, data),
    onSuccess: (data) => {
      toast.success(`Invite created: ${data.invite.code}`);
      queryClient.invalidateQueries({ queryKey: ['community', selectedSlug] });
    },
    onError: (error) => toast.error(error.response?.data?.error?.message || 'Could not create invite'),
  });

  const joinWithCodeMutation = useMutation({
    mutationFn: (code) => joinWithCode(code),
    onSuccess: () => {
      toast.success('Joined community');
      queryClient.invalidateQueries({ queryKey: ['community', selectedSlug] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
    onError: (error) => toast.error(error.response?.data?.error?.message || 'Invalid code'),
  });

  const submitMutation = useMutation({
    mutationFn: ({ testId, answer }) => submitCommunityTest(community._id, testId, { answer }),
    onSuccess: () => {
      toast.success('Answer submitted');
      queryClient.invalidateQueries({ queryKey: ['community', selectedSlug] });
    },
    onError: (error) => toast.error(error.response?.data?.error?.message || 'Could not submit answer'),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ testId, submissionId, score, feedback }) => reviewCommunitySubmission(community._id, testId, submissionId, { score, feedback }),
    onSuccess: () => {
      toast.success('Submission reviewed');
      queryClient.invalidateQueries({ queryKey: ['community', selectedSlug] });
    },
    onError: (error) => toast.error(error.response?.data?.error?.message || 'Could not review submission'),
  });

  if (communitiesQuery.isLoading || (selectedSlug && communityQuery.isLoading)) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.14),_transparent_36%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.92))] p-7 md:p-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-teal-300 font-semibold">Community hub</p>
          <h1 className="text-3xl md:text-5xl font-black leading-tight">Create a class, share notes, and control who sees results.</h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl">
            Build private communities for tests. The creator can review every answer, while students only see their own results unless they are the community owner or admin.
          </p>
          {!user && <div className="text-sm text-amber-200">Login to create communities, submit answers, or share files.</div>}
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-6 items-start">
        <aside className={`${cardClass} p-5 md:p-6 space-y-4`}>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your communities</h2>
            <p className="text-sm text-slate-500">Pick one to manage tests, notes, and results.</p>
          </div>
          <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
            {communities.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => setSelectedSlug(item.slug)}
                className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${selectedSlug === item.slug ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-white hover:border-teal-200'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-500">@{item.slug}</div>
                  </div>
                  <span className="text-[11px] rounded-full bg-slate-100 px-2 py-1 text-slate-600">{item.isPublic ? 'Public' : 'Private'}</span>
                </div>
              </button>
            ))}
            {communities.length === 0 && <div className="text-sm text-slate-500">No communities yet.</div>}
          </div>

          <form
            className="space-y-3 border-t border-slate-200 pt-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!user) return toast.error('Login required');
              createCommunityMutation.mutate(communityForm);
            }}
          >
            <div>
              <h3 className="font-semibold text-slate-900">Create community</h3>
              <p className="text-xs text-slate-500">Start a private class or public study group.</p>
            </div>
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Community name" value={communityForm.name} onChange={(e) => setCommunityForm((prev) => ({ ...prev, name: e.target.value }))} />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="slug-for-url" value={communityForm.slug} onChange={(e) => setCommunityForm((prev) => ({ ...prev, slug: e.target.value }))} />
            <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" rows="3" placeholder="Description" value={communityForm.description} onChange={(e) => setCommunityForm((prev) => ({ ...prev, description: e.target.value }))} />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={communityForm.isPublic} onChange={(e) => setCommunityForm((prev) => ({ ...prev, isPublic: e.target.checked }))} />
              Public community
            </label>
            <button className="w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-50" disabled={createCommunityMutation.isPending}>
              Create
            </button>
          </form>
        </aside>

        <main className="space-y-6">
          {!community ? (
            <div className={`${cardClass} p-6 text-slate-500`}>Select a community to continue.</div>
          ) : (
            <>
              <section className={`${cardClass} p-6 md:p-7 space-y-4`}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900">{community.name}</h2>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">@{community.slug}</span>
                    </div>
                    <p className="mt-2 text-slate-600 max-w-3xl">{community.description || 'No description yet.'}</p>
                    <div className="mt-3 text-sm text-slate-500">
                      Owner: {community.owner?.username} · Members: {community.members?.length || 0} · Results visible to creator/admin only
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {user && community.owner?._id === user._id && (
                      <button
                        type="button"
                        onClick={() => generateInviteMutation.mutate({ singleUse: false })}
                        className="rounded-xl border border-teal-300 bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700 hover:bg-teal-100"
                      >
                        Create invite
                      </button>
                    )}
                    {user && !viewer.isMember && (
                      <button
                        type="button"
                        onClick={() => joinMutation.mutate(community._id)}
                        className="rounded-xl border border-teal-300 bg-teal-50 px-4 py-2.5 text-sm font-semibold text-teal-700 hover:bg-teal-100"
                      >
                        Join community
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <NotificationsPanel />
                </div>
                <div className="mt-4">
                  <CommunitySidebar community={community} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Tests</div>
                    <div className="mt-1 text-2xl font-black text-slate-900">{tests.length}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Resources</div>
                    <div className="mt-1 text-2xl font-black text-slate-900">{resources.length}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Visible results</div>
                    <div className="mt-1 text-2xl font-black text-slate-900">{viewer.canSeeAllResults ? 'All' : 'Mine only'}</div>
                  </div>
                </div>
              </section>

              {viewer.isMember && (
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <form
                    className={`${cardClass} p-6 space-y-3`}
                    onSubmit={(e) => {
                      e.preventDefault();
                      createTestMutation.mutate({ ...testForm, dueAt: testForm.dueAt || null });
                    }}
                  >
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Create test</h3>
                      <p className="text-sm text-slate-500">Members can submit answers. Only the creator/admin can review every result.</p>
                    </div>
                    <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Test title" value={testForm.title} onChange={(e) => setTestForm((prev) => ({ ...prev, title: e.target.value }))} />
                    <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Short description" value={testForm.description} onChange={(e) => setTestForm((prev) => ({ ...prev, description: e.target.value }))} />
                    <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" rows="5" placeholder="Prompt / instructions for this test" value={testForm.prompt} onChange={(e) => setTestForm((prev) => ({ ...prev, prompt: e.target.value }))} />
                    <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="datetime-local" value={testForm.dueAt} onChange={(e) => setTestForm((prev) => ({ ...prev, dueAt: e.target.value }))} />
                    <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50" disabled={createTestMutation.isPending}>
                      Publish test
                    </button>
                  </form>

                  <form
                    className={`${cardClass} p-6 space-y-3`}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (resourceForm.kind === 'file') {
                        if (!uploadFile) return toast.error('Select a file first');
                        const fd = new FormData();
                        fd.append('file', uploadFile);
                        fd.append('title', resourceForm.title || uploadFile.name);
                        fd.append('body', resourceForm.body || '');
                        uploadMutation.mutate(fd);
                      } else {
                        createResourceMutation.mutate(resourceForm);
                      }
                    }}
                  >
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Share notes or files</h3>
                      <p className="text-sm text-slate-500">Upload by link or share a structured note for the whole community.</p>
                    </div>
                    <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={resourceForm.kind} onChange={(e) => setResourceForm((prev) => ({ ...prev, kind: e.target.value }))}>
                      <option value="note">Note</option>
                      <option value="file">File</option>
                      <option value="link">Link</option>
                    </select>
                    <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Title" value={resourceForm.title} onChange={(e) => setResourceForm((prev) => ({ ...prev, title: e.target.value }))} />
                    <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" rows="4" placeholder="Note content or file details" value={resourceForm.body} onChange={(e) => setResourceForm((prev) => ({ ...prev, body: e.target.value }))} />
                    <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="File name (optional)" value={resourceForm.fileName} onChange={(e) => setResourceForm((prev) => ({ ...prev, fileName: e.target.value }))} />
                    <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="File or link URL (optional)" value={resourceForm.fileUrl} onChange={(e) => setResourceForm((prev) => ({ ...prev, fileUrl: e.target.value }))} />
                    {resourceForm.kind === 'file' && (
                      <div className="space-y-2">
                        <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
                        {uploadFile && <div className="text-sm text-slate-600">Selected: {uploadFile.name}</div>}
                      </div>
                    )}
                    <button className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-50" disabled={createResourceMutation.isPending}>
                      Share
                    </button>
                  </form>
                </section>
              )}

              {/* Invite code join area for non-members */}
              {!viewer.isMember && (
                <div className={`${cardClass} p-6`}> 
                  <h4 className="font-semibold text-slate-900">Join with code</h4>
                  <div className="flex gap-2 mt-2">
                    <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm flex-1" placeholder="Enter invite code" value={inviteCodeInput} onChange={(e) => setInviteCodeInput(e.target.value)} />
                    <button onClick={() => joinWithCodeMutation.mutate(inviteCodeInput)} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white">Join</button>
                  </div>
                </div>
              )}

              <section className="grid grid-cols-1 gap-6">
                {tests.map((test) => {
                  const mySubmission = submissions.find((submission) => submission.communityTest?._id === test._id && submission.user?._id === user?._id);
                  const submissionsForTest = viewer.canSeeAllResults ? submissions.filter((submission) => submission.communityTest?._id === test._id) : mySubmission ? [mySubmission] : [];

                  return (
                    <div key={test._id} className={`${cardClass} p-6 space-y-4`}>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{test.title}</h3>
                          <p className="text-sm text-slate-500 mt-1">{test.description || 'Community test'}</p>
                        </div>
                        {test.dueAt && <div className="text-xs rounded-full bg-amber-50 px-3 py-1 text-amber-700">Due {new Date(test.dueAt).toLocaleString()}</div>}
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 text-slate-700 whitespace-pre-wrap">{test.prompt}</div>

                      {viewer.isMember && (
                        <form
                          className="space-y-3"
                          onSubmit={(e) => {
                            e.preventDefault();
                            submitMutation.mutate({ testId: test._id, answer: submissionDrafts[test._id] || '' });
                          }}
                        >
                          <textarea
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                            rows="4"
                            placeholder="Write your answer"
                            value={submissionDrafts[test._id] || ''}
                            onChange={(e) => setSubmissionDrafts((prev) => ({ ...prev, [test._id]: e.target.value }))}
                          />
                          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50" disabled={submitMutation.isPending}>
                            Submit answer
                          </button>
                        </form>
                      )}

                      <div className="space-y-3 border-t border-slate-200 pt-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-900">Results</h4>
                          <span className="text-xs text-slate-500">{viewer.canSeeAllResults ? 'Creator/admin can see every answer' : 'You can only see your own result'}</span>
                        </div>
                        {submissionsForTest.length === 0 && <div className="text-sm text-slate-500">No submissions yet.</div>}
                        {submissionsForTest.map((submission) => {
                          const isOwner = viewer.canSeeAllResults;
                          const draftKey = submission._id;

                          return (
                            <div key={submission._id} className="rounded-xl border border-slate-200 bg-white p-4">
                              <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                  <div className="font-semibold text-slate-900">{submission.user?.username || 'Student'}</div>
                                  <div className="text-xs text-slate-500">{submission.status} · score {submission.score ?? 0}</div>
                                </div>
                                <div className="text-xs text-slate-500">{new Date(submission.createdAt).toLocaleString()}</div>
                              </div>
                              <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 whitespace-pre-wrap">{submission.answer}</div>
                              {submission.feedback && <div className="mt-3 text-sm text-teal-700">Feedback: {submission.feedback}</div>}
                              {isOwner && (
                                <form
                                  className="mt-3 grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)_auto] gap-2"
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    const draft = reviewDrafts[draftKey] || { score: submission.score ?? 0, feedback: submission.feedback || '' };
                                    reviewMutation.mutate({ testId: test._id, submissionId: submission._id, score: Number(draft.score || 0), feedback: draft.feedback || '' });
                                  }}
                                >
                                  <input
                                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={reviewDrafts[draftKey]?.score ?? submission.score ?? 0}
                                    onChange={(e) =>
                                      setReviewDrafts((prev) => ({
                                        ...prev,
                                        [draftKey]: { score: e.target.value, feedback: prev[draftKey]?.feedback ?? submission.feedback ?? '' },
                                      }))
                                    }
                                  />
                                  <input
                                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                    placeholder="Feedback"
                                    value={reviewDrafts[draftKey]?.feedback ?? submission.feedback ?? ''}
                                    onChange={(e) =>
                                      setReviewDrafts((prev) => ({
                                        ...prev,
                                        [draftKey]: { score: prev[draftKey]?.score ?? submission.score ?? 0, feedback: e.target.value },
                                      }))
                                    }
                                  />
                                  <button className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-50" disabled={reviewMutation.isPending}>
                                    Review
                                  </button>
                                </form>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </section>

              <section className={`${cardClass} p-6 space-y-4`}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Shared notes and files</h3>
                    <p className="text-sm text-slate-500">Every member can view these resources.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map((resource) => (
                    <div key={resource._id} className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-900">{resource.title}</div>
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{resource.kind}</div>
                        </div>
                        <div className="text-xs text-slate-500">By {resource.sharedBy?.username || 'member'}</div>
                      </div>
                      {resource.body && <div className="mt-3 text-sm text-slate-600 whitespace-pre-wrap">{resource.body}</div>}
                      {resource.fileUrl && (
                        <a href={resource.fileUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-teal-700 no-underline hover:underline">
                          Open resource
                        </a>
                      )}
                    </div>
                  ))}
                  {resources.length === 0 && <div className="text-sm text-slate-500">No resources shared yet.</div>}
                </div>
              </section>

              <div className="text-sm text-slate-500">
                Need to move back to problem solving? <Link to="/problems">Open problems</Link>.
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}