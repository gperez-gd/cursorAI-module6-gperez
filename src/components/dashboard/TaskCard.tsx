type Priority = 'low' | 'medium' | 'high';
type Status = 'todo' | 'in-progress' | 'done';

export interface DashboardTask {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  assignee?: string;
  dueDate?: string;
}

const priorityConfig: Record<Priority, { label: string; classes: string }> = {
  low: { label: 'Low', classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  medium: { label: 'Medium', classes: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  high: { label: 'High', classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

const statusConfig: Record<Status, { label: string; dot: string }> = {
  'todo': { label: 'To Do', dot: 'bg-gray-400' },
  'in-progress': { label: 'In Progress', dot: 'bg-blue-500' },
  'done': { label: 'Done', dot: 'bg-green-500' },
};

interface TaskCardProps {
  task: DashboardTask;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { label: priorityLabel, classes: priorityClasses } = priorityConfig[task.priority];
  const { label: statusLabel, dot: statusDot } = statusConfig[task.status];

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <article
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 hover:shadow-lg
        transition-all duration-300 border-l-4
        border-l-transparent hover:border-l-primary"
      aria-label={`Task: ${task.title}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug line-clamp-2">
          {task.title}
        </h3>
        <span className={`shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ${priorityClasses}`}>
          {priorityLabel}
        </span>
      </div>

      {task.description && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{task.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${statusDot}`} aria-hidden="true" />
          <span className="text-xs text-gray-500 dark:text-gray-400">{statusLabel}</span>
        </div>

        <div className="flex items-center gap-2">
          {task.assignee && (
            <div
              className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center"
              title={task.assignee}
              aria-label={`Assigned to ${task.assignee}`}
            >
              {task.assignee[0].toUpperCase()}
            </div>
          )}
          {task.dueDate && (
            <span className={`text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
              {isOverdue && '⚠ '}
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
