import { useState, useCallback } from 'react';
import type { BoardState, Task, Column, FilterState } from './types';
import {
  BOARD_STORAGE_KEY, BOARD_VERSION_KEY, BOARD_VERSION,
  DEFAULT_COLUMNS, DEFAULT_TASKS, ACCENT_COLORS,
} from './types';
import BoardColumn from './BoardColumn';
import BoardHeader from './BoardHeader';
import TaskModal from './TaskModal';
import { useToast } from '../ui/ToastProvider';

function loadBoard(): BoardState {
  try {
    const version = localStorage.getItem(BOARD_VERSION_KEY);
    if (version !== BOARD_VERSION) throw new Error('version mismatch');
    const raw = localStorage.getItem(BOARD_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as BoardState;
  } catch {
    console.warn('[KanbanBoard] Failed to load state, falling back to defaults.');
  }
  return { columns: DEFAULT_COLUMNS, tasks: DEFAULT_TASKS };
}

function saveBoard(state: BoardState) {
  try {
    localStorage.setItem(BOARD_VERSION_KEY, BOARD_VERSION);
    localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const DEFAULT_FILTERS: FilterState = { search: '', priorities: [], assigneeId: '', overdueOnly: false };

export default function KanbanBoard() {
  const { addToast } = useToast();
  const [board, setBoardRaw] = useState<BoardState>(loadBoard);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [modal, setModal] = useState<
    | { mode: 'create'; columnId: string }
    | { mode: 'edit'; task: Task }
    | null
  >(null);

  function setBoard(next: BoardState | ((prev: BoardState) => BoardState)) {
    setBoardRaw(prev => {
      const updated = typeof next === 'function' ? next(prev) : next;
      saveBoard(updated);
      return updated;
    });
  }

  function handleAddTask(columnId: string) {
    setModal({ mode: 'create', columnId });
  }

  function handleEditTask(task: Task) {
    setModal({ mode: 'edit', task });
  }

  function handleSaveTask(data: Omit<Task, 'id' | 'createdAt' | 'order'> & { id?: string }) {
    if (data.id) {
      // Edit existing
      setBoard(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === data.id ? { ...t, ...data } as Task : t),
      }));
      addToast('success', 'Task updated');
    } else {
      // Create new
      const colTasks = board.tasks.filter(t => t.columnId === data.columnId);
      const newTask: Task = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        order: colTasks.length,
      };
      setBoard(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
      addToast('success', 'Task created');
    }
  }

  function handleDeleteTask(taskId: string) {
    setBoard(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== taskId) }));
    addToast('info', 'Task deleted');
  }

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', taskId);
    setDraggingTaskId(taskId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetColumnId: string, insertIndex: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    setDraggingTaskId(null);
    if (!taskId) return;

    setBoard(prev => {
      const task = prev.tasks.find(t => t.id === taskId);
      if (!task) return prev;

      const targetCol = prev.columns.find(c => c.id === targetColumnId);
      const targetColTasks = prev.tasks.filter(t => t.columnId === targetColumnId && t.id !== taskId);

      if (targetCol?.taskLimit !== undefined && targetColTasks.length >= targetCol.taskLimit) {
        addToast('warning', 'Column is at WIP limit');
        return prev;
      }

      const reordered = [
        ...targetColTasks.slice(0, insertIndex),
        { ...task, columnId: targetColumnId },
        ...targetColTasks.slice(insertIndex),
      ].map((t, i) => ({ ...t, order: i }));

      const otherTasks = prev.tasks.filter(t => t.columnId !== targetColumnId && t.id !== taskId);
      return { ...prev, tasks: [...otherTasks, ...reordered] };
    });
  }, [addToast]);

  function handleAddColumn(title: string) {
    const color = ACCENT_COLORS[board.columns.length % ACCENT_COLORS.length];
    const newCol: Column = { id: crypto.randomUUID(), title, color };
    setBoard(prev => ({ ...prev, columns: [...prev.columns, newCol] }));
    addToast('success', `Column "${title}" added`);
  }

  function handleRenameColumn(columnId: string, title: string) {
    setBoard(prev => ({
      ...prev,
      columns: prev.columns.map(c => c.id === columnId ? { ...c, title } : c),
    }));
  }

  function handleDeleteColumn(columnId: string) {
    const hasTasks = board.tasks.some(t => t.columnId === columnId);
    if (hasTasks) {
      addToast('warning', 'Remove all tasks before deleting the column');
      return;
    }
    setBoard(prev => ({
      ...prev,
      columns: prev.columns.filter(c => c.id !== columnId),
    }));
    addToast('info', 'Column deleted');
  }

  function handleResetBoard() {
    const fresh = { columns: DEFAULT_COLUMNS, tasks: DEFAULT_TASKS };
    setBoard(fresh);
    addToast('info', 'Board reset to defaults');
  }

  void handleDeleteTask; // referenced for completeness

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <BoardHeader
        filters={filters}
        onFiltersChange={setFilters}
        onFiltersClear={() => setFilters(DEFAULT_FILTERS)}
        onAddColumn={handleAddColumn}
        onResetBoard={handleResetBoard}
      />

      {/* Board */}
      <div
        className="flex-1 overflow-x-auto overflow-y-hidden p-4"
        style={{ scrollSnapType: 'x mandatory' }}
        aria-label="Kanban board"
      >
        <div className="flex gap-4 h-full min-h-0">
          {board.columns.map(column => (
            <div key={column.id} style={{ scrollSnapAlign: 'start' }} className="flex-shrink-0 h-full flex flex-col">
              <BoardColumn
                column={column}
                tasks={board.tasks.filter(t => t.columnId === column.id)}
                filters={filters}
                draggingTaskId={draggingTaskId}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onRenameColumn={handleRenameColumn}
                onDeleteColumn={handleDeleteColumn}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <TaskModal
          mode={modal.mode}
          task={modal.mode === 'edit' ? modal.task : undefined}
          columns={board.columns}
          defaultColumnId={modal.mode === 'create' ? modal.columnId : modal.task.columnId}
          onSave={handleSaveTask}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
