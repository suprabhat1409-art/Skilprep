import React from 'react';

export default function NotificationsPanel({ notifications = [] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 w-full max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-slate-900">Notifications</div>
      </div>
      {notifications.length === 0 ? (
        <div className="text-sm text-slate-500">No notifications</div>
      ) : (
        <ul className="space-y-2 text-sm text-slate-700">
          {notifications.map((n) => (
            <li key={n.id} className="rounded-md bg-slate-50 p-2">
              <div className="font-medium">{n.title}</div>
              <div className="text-xs text-slate-500">{n.body}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
