import { useQuery } from '@tanstack/react-query';
import { getFields } from '../../api/fieldApi';

export default function ProblemFilters({ filters, onChange }) {
  const { data } = useQuery({ queryKey: ['fields'], queryFn: getFields });
  const fields = data?.fields || [];

  const set = (key, value) => onChange({ ...filters, [key]: value, page: 1 });

  return (
    <div className="flex flex-wrap gap-3 items-center mb-6">
      <input
        type="text"
        placeholder="Search problems..."
        value={filters.search || ''}
        onChange={(e) => set('search', e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
      />

      <select
        value={filters.field || ''}
        onChange={(e) => set('field', e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Fields</option>
        {fields.map((f) => (
          <option key={f.slug} value={f.slug}>{f.name}</option>
        ))}
      </select>

      <select
        value={filters.difficulty || ''}
        onChange={(e) => set('difficulty', e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <select
        value={filters.sort || 'newest'}
        onChange={(e) => set('sort', e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="popular">Most Popular</option>
      </select>

      {(filters.search || filters.field || filters.difficulty) && (
        <button
          onClick={() => onChange({ page: 1, sort: 'newest' })}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
