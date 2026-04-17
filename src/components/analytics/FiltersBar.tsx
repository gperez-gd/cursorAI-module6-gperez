import type { FiltersState } from './types';
import DateRangePicker from './DateRangePicker';
import SelectFilter from './SelectFilter';

interface FiltersBarProps {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
  onReset: () => void;
  loading: boolean;
}

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'services', label: 'Services' },
];

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export default function FiltersBar({ filters, onChange, onReset, loading }: FiltersBarProps) {
  const hasActive = filters.startDate || filters.endDate || filters.category || filters.status !== 'all';

  return (
    <section
      aria-label="Filters"
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4"
    >
      <div className="flex flex-wrap gap-4 items-end">
        <DateRangePicker
          startDate={filters.startDate}
          endDate={filters.endDate}
          onStartChange={v => onChange({ ...filters, startDate: v })}
          onEndChange={v => onChange({ ...filters, endDate: v })}
        />

        <SelectFilter
          id="filter-category"
          label="Category"
          value={filters.category}
          options={categoryOptions}
          onChange={v => onChange({ ...filters, category: v })}
        />

        <SelectFilter
          id="filter-status"
          label="Status"
          value={filters.status}
          options={statusOptions}
          onChange={v => onChange({ ...filters, status: v as FiltersState['status'] })}
        />

        <button
          onClick={onReset}
          disabled={!hasActive || loading}
          aria-label="Reset all filters"
          className="self-end flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400
            bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600
            disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Filters
        </button>
      </div>
    </section>
  );
}
