import { useState, useEffect, useRef } from 'react';
import type { Task, Priority, Column } from './types';
import { TEAM_MEMBERS } from '../../constants/teamMembers';

type ModalMode = 'create' | 'edit';

interface TaskModalProps {
  mode: ModalMode;
  task?: Task;
  columns: Column[];
  defaultColumnId: string;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'order'> & { id?: string }) => void;
  onClose: () => void;
}

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export default function TaskModal({ mode, task, columns, defaultColumnId, onSave, onClose }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium');
  const [columnId, setColumnId] = useState(task?.columnId ?? defaultColumnId);
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '');
  const [tags, setTags] = useState(task?.tags?.join(', ') ?? '');
  const [assigneeIds, setAssigneeIds] = useState<string[]>(task?.assignees.map(a => a.id) ?? []);
  const [dirty, setDirty] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (dirty) {
          if (confirm('Discard unsaved changes?')) onClose();
        } else {
          onClose();
        }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [dirty, onClose]);

  function markDirty() { setDirty(true); }

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === backdropRef.current) {
      if (dirty) { if (confirm('Discard unsaved changes?')) onClose(); }
      else onClose();
    }
  }

  function toggleAssignee(id: string) {
    markDirty();
    setAssigneeIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  function handleSave() {
    if (!title.trim()) return;
    const assignees = TEAM_MEMBERS.filter(m => assigneeIds.includes(m.id));
    onSave({
      ...(mode === 'edit' && task ? { id: task.id } : {}),
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      assignees,
      dueDate: dueDate || undefined,
      columnId,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    onClose();
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdrop}
      aria-hidden="false"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto
          transition-all duration-200"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <h2 id="task-modal-title" className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {mode === 'create' ? 'New Task' : 'Edit Task'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="task-title"
              ref={titleRef}
              value={title}
              onChange={e => { setTitle(e.target.value); markDirty(); }}
              maxLength={120}
              required
              placeholder="Task title"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-400 text-right mt-0.5">{title.length}/120</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              id="task-desc"
              value={description}
              onChange={e => { setDescription(e.target.value); markDirty(); }}
              maxLength={500}
              rows={3}
              placeholder="Optional description…"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-400 text-right">{description.length}/500</p>
          </div>

          {/* Priority + Column */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select
                id="task-priority"
                value={priority}
                onChange={e => { setPriority(e.target.value as Priority); markDirty(); }}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="task-column" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Column</label>
              <select
                id="task-column"
                value={columnId}
                onChange={e => { setColumnId(e.target.value); markDirty(); }}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
          </div>

          {/* Due Date + Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="task-due" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
              <input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={e => { setDueDate(e.target.value); markDirty(); }}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="task-tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
              <input
                id="task-tags"
                value={tags}
                onChange={e => { setTags(e.target.value); markDirty(); }}
                placeholder="design, backend"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Assignees */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assignees</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Select assignees">
              {TEAM_MEMBERS.map(member => {
                const selected = assigneeIds.includes(member.id);
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleAssignee(member.id)}
                    aria-pressed={selected}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all
                      ${selected
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[10px]">
                      {member.name[0]}
                    </span>
                    {member.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700
              rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            aria-disabled={!title.trim()}
            className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg
              hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {mode === 'create' ? 'Create Task' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
