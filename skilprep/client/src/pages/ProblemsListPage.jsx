import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProblems } from '../api/problemApi';
import ProblemCard from '../components/problems/ProblemCard';
import ProblemFilters from '../components/problems/ProblemFilters';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ProblemsListPage() {
  const [searchParams] = useSearchParams();
  const initialField = searchParams.get('field') || '';
  const [filters, setFilters] = useState({ page: 1, sort: 'newest', field: initialField });

  const params = {};
  if (filters.field) params.field = filters.field;
  if (filters.difficulty) params.difficulty = filters.difficulty;
  if (filters.search) params.search = filters.search;
  params.sort = filters.sort || 'newest';
  params.page = filters.page || 1;
  params.limit = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ['problems', params],
    queryFn: () => getProblems(params),
    keepPreviousData: true,
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Problems</h2>

      <ProblemFilters filters={filters} onChange={setFilters} />

      {isLoading && <LoadingSpinner />}

      {error && (
        <div className="text-center py-8 text-red-500">
          Failed to load problems. Please try again.
        </div>
      )}

      {data && (
        <>
          <div className="text-sm text-gray-500 mb-4">
            {data.total} problem{data.total !== 1 ? 's' : ''} found
          </div>
          <div className="space-y-2">
            {data.problems.map((problem) => (
              <ProblemCard key={problem._id} problem={problem} />
            ))}
          </div>
          {data.problems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No problems match your filters.
            </div>
          )}
          <Pagination
            page={data.page}
            pages={data.pages}
            onPageChange={(p) => setFilters({ ...filters, page: p })}
          />
        </>
      )}
    </div>
  );
}
