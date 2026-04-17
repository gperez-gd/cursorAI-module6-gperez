import type { Task } from './types';
import PriorityBadge from './PriorityBadge';
import AssigneeAvatar from './AssigneeAvatar';
import DueDateLabel from './DueDateLabel';

interface TaskCardProps {
  task: Task;
  isDragging: boolean;
  onEdit: (task: Task) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

export default function TaskCard({ task, isDragging, onEdit, onDragStart }: TaskCardProps) {
  return (
    <article
      draggable
      onDragStart={e => onDragStart(e, task.id)}
      onClick={() => onEdit(task)}
      aria-grabbed={isDragging}
      aria-label={`Task: ${task.title}`}
      className={`group bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600
        p-3 cursor-grab active:cursor-grabbing
        hover:shadow-md hover:scale-[1.01] transition-all duration-200
        ${isDragging ? 'opacity-50 shadow-lg scale-95' : ''}`}
    >
      {/* Drag handle */}
      <div className="flex items-start gap-2">
        <div className="shrink-0 mt-1 opacity-0 group-hover:opacity-40 transition-opacity cursor-grab" aria-hidden="true">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 6a2 2 0 100-4 2 2 0 000 4zM8 14a2 2 0 100-4 2 2 0 000 4zM8 22a2 2 0 100-4 2 2 0 000 4zM16 6a2 2 0 100-4 2 2 0 000 4zM16 14a2 2 0 100-4 2 2 0 000 4zM16 22a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
            {task.title}
          </p>
        </div>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.map(tag => (
            <span key={tag} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2.5 gap-2">
        {task.assignees.length > 0 && <AssigneeAvatar assignees={task.assignees} />}
        {task.dueDate && <DueDateLabel dueDate={task.dueDate} done={false} />}
      </div>
    </article>
  );
}
