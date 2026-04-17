interface DueDateLabelProps {
  dueDate: string;
  done?: boolean;
}

export default function DueDateLabel({ dueDate, done = false }: DueDateLabelProps) {
  const date = new Date(dueDate);
  const isOverdue = !done && date < new Date();
  const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <span
      className={`flex items-center gap-1 text-xs font-medium
        ${isOverdue ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}
      aria-label={`Due ${formatted}${isOverdue ? ' (overdue)' : ''}`}
    >
      {isOverdue && (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )}
      {formatted}
    </span>
  );
}
