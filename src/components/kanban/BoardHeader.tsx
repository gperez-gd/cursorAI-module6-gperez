import { useState } from 'react';
import type { FilterState } from './types';
import BoardFilters from './BoardFilters';

interface BoardHeaderProps {
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  onFiltersClear: () => void;
  onAddColumn: (title: string) => void;
  onResetBoard: () => void;
}

export default function BoardHeader({ filters, onFiltersChange, onFiltersClear, onAddColumn, onResetBoard }: BoardHeaderProps) {
  const [addingColumn, setAddingColumn] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const activeCount = [
    filters.search, filters.priorities.length > 0, filters.assigneeId, filters.overdueOnly
  ].filter(Boolean).length;

  function handleAddColumn() {
    const t = columnTitle.trim();
    if (t) { onAddColumn(t); setColumnTitle(''); setAddingColumn(false); }
  }

  function handleColumnKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAddColumn();
    if (e.key === 'Escape') { setColumnTitle(''); setAddingColumn(false); }
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex flex-wrap items-center gap-3">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mr-2">Kanban Board</h2>

      {/* Filter toggle */}
      <button
        onClick={() => setShowFilters(v => !v)}
        aria-pressed={showFilters}
        aria-label={`${showFilters ? 'Hide' : 'Show'} filters${activeCount > 0 ? ` (${activeCount} active)` : ''}`}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors
          ${showFilters ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Add Column */}
      {addingColumn ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={columnTitle}
            onChange={e => setColumnTitle(e.target.value)}
            onKeyDown={handleColumnKeyDown}
            placeholder="Column name"
            aria-label="New column name"
            className="px-3 py-1.5 text-sm border border-primary rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-primary w-36"
          />
          <button onClick={handleAddColumn} className="px-2 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">Add</button>
          <button onClick={() => { setAddingColumn(false); setColumnTitle(''); }} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
        </div>
      ) : (
        <button
          onClick={() => setAddingColumn(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Column
        </button>
      )}

      <button
        onClick={() => { if (confirm('Reset board to defaults? This will delete all tasks and columns.')) onResetBoard(); }}
        className="ml-auto text-xs text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Reset board"
      >
        Reset board
      </button>

      {showFilters && (
        <div className="w-full mt-1">
          <BoardFilters filters={filters} onChange={onFiltersChange} onClear={onFiltersClear} />
        </div>
      )}
    </div>
  );
}
