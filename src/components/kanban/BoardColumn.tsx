import { useState } from 'react';
import type { Column, Task, FilterState } from './types';
import ColumnHeader from './ColumnHeader';
import TaskCard from './TaskCard';

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  filters: FilterState;
  draggingTaskId: string | null;
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onRenameColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string, insertIndex: number) => void;
}

function matchesFilters(task: Task, filters: FilterState): boolean {
  const q = filters.search.toLowerCase();
  if (q && !task.title.toLowerCase().includes(q) && !(task.description ?? '').toLowerCase().includes(q)) return false;
  if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) return false;
  if (filters.assigneeId && !task.assignees.some(a => a.id === filters.assigneeId)) return false;
  if (filters.overdueOnly && (!task.dueDate || new Date(task.dueDate) >= new Date())) return false;
  return true;
}

export default function BoardColumn({
  column, tasks, filters, draggingTaskId,
  onAddTask, onEditTask, onRenameColumn, onDeleteColumn,
  onDragStart, onDragOver, onDrop,
}: BoardColumnProps) {
  const [dragOver, setDragOver] = useState(false);

  const sorted = [...tasks].sort((a, b) => a.order - b.order);
  const visible = sorted.filter(t => matchesFilters(t, filters));
  const hasActiveFilters = filters.search || filters.priorities.length || filters.assigneeId || filters.overdueOnly;

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
    onDragOver(e);
  }

  function handleDrop(e: React.DragEvent, idx: number) {
    setDragOver(false);
    onDrop(e, column.id, idx);
  }

  return (
    <div
      className={`flex flex-col bg-gray-50 dark:bg-gray-800/60 rounded-2xl border
        min-w-[280px] max-w-[280px] max-h-full
        transition-all duration-150
        ${dragOver
          ? 'border-primary border-dashed bg-primary/5 dark:bg-primary/10'
          : 'border-gray-200 dark:border-gray-700'
        }`}
      onDragLeave={() => setDragOver(false)}
      onDragOver={e => handleDragOver(e)}
      onDrop={e => handleDrop(e, visible.length)}
    >
      <ColumnHeader
        column={column}
        tasks={tasks}
        onAddTask={() => onAddTask(column.id)}
        onRename={title => onRenameColumn(column.id, title)}
        onDelete={() => onDeleteColumn(column.id)}
      />

      <div
        className="flex-1 overflow-y-auto p-2 space-y-2"
        aria-label={`${column.title} column, ${visible.length} visible tasks`}
      >
        {visible.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-xs text-gray-400 dark:text-gray-500 italic">
            {hasActiveFilters ? 'No matching tasks' : 'No tasks yet'}
          </div>
        ) : (
          visible.map((task, idx) => (
            <div
              key={task.id}
              onDragOver={e => handleDragOver(e)}
              onDrop={e => handleDrop(e, idx)}
            >
              <TaskCard
                task={task}
                isDragging={draggingTaskId === task.id}
                onEdit={onEditTask}
                onDragStart={onDragStart}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
