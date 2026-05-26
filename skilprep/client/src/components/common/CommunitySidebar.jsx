import React from 'react';

export default function CommunitySidebar({ community }) {
  if (!community) return null;

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 w-full max-w-[280px]">
      <div className="mb-3">
        <div className="text-sm font-semibold text-slate-900">Members</div>
        <div className="text-xs text-slate-500">{community.members?.length || 0} members</div>
      </div>
      <ul className="space-y-2">
        {(community.members || []).slice(0, 8).map((m) => (
          <li key={m._id} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-100" />
            <div className="text-sm text-slate-700">{m.username}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
