import { useState } from 'react';

export default function CommentForm({ onSubmit, submitting, placeholder = 'Write a comment...', buttonLabel = 'Post comment', initialValue = '' }) {
  const [body, setBody] = useState(initialValue);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(body);
        setBody('');
      }}
      className="space-y-3"
    >
      <textarea
        rows={4}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? 'Posting...' : buttonLabel}
        </button>
      </div>
    </form>
  );
}