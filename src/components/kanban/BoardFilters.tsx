import type { FilterState, Priority } from './types';
import { TEAM_MEMBERS } from '../../constants/teamMembers';

interface BoardFiltersProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClear: () => void;
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'critical'];

function activeFilterCount(f: FilterState): number {
  let n = 0;
  if (f.search) n++;
  if (f.priorities.length > 0) n++;
  if (f.assigneeId) n++;
  if (f.overdueOnly) n++;
  return n;
}

export default function BoardFilters({ filters, onChange, onClear }: BoardFiltersProps) {
  const count = activeFilterCount(filters);

  function togglePriority(p: Priority) {
    const next = filters.priorities.includes(p)
      ? filters.priorities.filter(x => x !== p)
      : [...filters.priorities, p];
    onChange({ ...filters, priorities: next });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          placeholder="Search tasks…"
          value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          aria-label="Search tasks"
          className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-primary w-44"
        />
      </div>

      {/* Priority multi-select */}
      <div className="flex gap-1" role="group" aria-label="Filter by priority">
        {PRIORITIES.map(p => (
          <button
            key={p}
            onClick={() => togglePriority(p)}
            aria-pressed={filters.priorities.includes(p)}
            className={`px-2 py-1 text-xs font-medium rounded-full transition-all capitalize
              ${filters.priorities.includes(p)
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
              }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Assignee */}
      <div>
        <label htmlFor="filter-assignee" className="sr-only">Filter by assignee</label>
        <select
          id="filter-assignee"
          value={filters.assigneeId}
          onChange={e => onChange({ ...filters, assigneeId: e.target.value })}
          className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Assignees</option>
          {TEAM_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      {/* Overdue toggle */}
      <button
        onClick={() => onChange({ ...filters, overdueOnly: !filters.overdueOnly })}
        aria-pressed={filters.overdueOnly}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all
          ${filters.overdueOnly
            ? 'bg-red-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
          }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Overdue only
      </button>

      {/* Clear filters */}
      {count > 0 && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400
            bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          aria-label={`Clear ${count} active filter${count !== 1 ? 's' : ''}`}
        >
          Clear
          <span className="bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
            {count}
          </span>
        </button>
      )}
    </div>
  );
}
