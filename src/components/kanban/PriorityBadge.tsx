import type { Priority } from './types';

const CONFIG: Record<Priority, { label: string; classes: string }> = {
  low: { label: 'Low', classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  medium: { label: 'Medium', classes: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  high: { label: 'High', classes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  critical: { label: 'Critical', classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

interface PriorityBadgeProps {
  priority: Priority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { label, classes } = CONFIG[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${classes}`}>
      {label}
    </span>
  );
}
