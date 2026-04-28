export default function CommentItem({ comment, depth = 0, onReply, onVote, canReply = true }) {
  return (
    <div className="space-y-3" style={{ marginLeft: depth * 20 }}>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900">{comment.author?.username || 'Anonymous'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase">{comment.author?.role || 'user'}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-gray-700 leading-6">{comment.body}</p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-xs text-gray-500">
              +{comment.upvotes || 0} / -{comment.downvotes || 0}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onVote(comment._id, 'up')}
                className="text-xs rounded-md border border-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-50"
              >
                Upvote
              </button>
              <button
                type="button"
                onClick={() => onVote(comment._id, 'down')}
                className="text-xs rounded-md border border-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-50"
              >
                Downvote
              </button>
            </div>
            {canReply && (
              <button
                type="button"
                onClick={() => onReply(comment)}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
              >
                Reply
              </button>
            )}
          </div>
        </div>
      </div>

      {comment.replies?.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
              onVote={onVote}
              canReply={canReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}