import { useState } from 'react';
import type { Column, Task } from './types';

interface ColumnHeaderProps {
  column: Column;
  tasks: Task[];
  onAddTask: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}

export default function ColumnHeader({ column, tasks, onAddTask, onRename, onDelete }: ColumnHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(column.title);
  const count = tasks.length;
  const atLimit = column.taskLimit !== undefined && count >= column.taskLimit;
  const overLimit = column.taskLimit !== undefined && count > column.taskLimit;

  function commitEdit() {
    const val = editValue.trim();
    if (val && val !== column.title) onRename(val);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') { setEditValue(column.title); setEditing(false); }
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 dark:border-gray-700">
      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: column.color ?? '#6b7280' }} aria-hidden="true" />

      {editing ? (
        <input
          autoFocus
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm font-semibold bg-transparent border-b border-primary outline-none text-gray-900 dark:text-gray-100"
          aria-label="Edit column title"
        />
      ) : (
        <h2
          className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-pointer truncate"
          onDoubleClick={() => setEditing(true)}
          title="Double-click to rename"
        >
          {column.title}
        </h2>
      )}

      <span
        className={`shrink-0 text-xs font-bold px-1.5 py-0.5 rounded-full transition-colors
          ${overLimit
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 animate-pulse'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}
        aria-label={`${count}${column.taskLimit ? ` of ${column.taskLimit}` : ''} tasks`}
      >
        {column.taskLimit ? `${count}/${column.taskLimit}` : count}
      </span>

      <button
        onClick={onAddTask}
        disabled={atLimit}
        title={atLimit ? 'WIP limit reached' : 'Add task'}
        aria-label={`Add task to ${column.title}`}
        className="shrink-0 p-0.5 rounded text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700
          disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <button
        onClick={onDelete}
        title={count > 0 ? 'Remove all tasks before deleting' : 'Delete column'}
        disabled={count > 0}
        aria-label={`Delete ${column.title} column`}
        className="shrink-0 p-0.5 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
          disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
