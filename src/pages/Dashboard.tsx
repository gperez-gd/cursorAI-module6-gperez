import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatsWidget from '../components/dashboard/StatsWidget';
import TaskCard, { type DashboardTask } from '../components/dashboard/TaskCard';

const STATS = [
  {
    label: 'Total Tasks',
    value: 142,
    change: 12,
    color: 'bg-primary/10 text-primary',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: 'In Progress',
    value: 38,
    change: -4,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Completed',
    value: 94,
    change: 18,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Overdue',
    value: 10,
    change: -2,
    color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
];

const TASKS: DashboardTask[] = [
  { id: '1', title: 'Design new landing page mockups', priority: 'high', status: 'in-progress', assignee: 'Alex', dueDate: '2026-04-20', description: 'Create high-fidelity Figma designs for the new marketing landing page.' },
  { id: '2', title: 'Fix authentication bug on mobile', priority: 'high', status: 'todo', assignee: 'Sarah', dueDate: '2026-04-15', description: 'Users are being logged out unexpectedly on iOS devices.' },
  { id: '3', title: 'Write unit tests for payment module', priority: 'medium', status: 'todo', assignee: 'Mike', dueDate: '2026-04-25' },
  { id: '4', title: 'Update API documentation', priority: 'low', status: 'in-progress', assignee: 'Jane', dueDate: '2026-04-30' },
  { id: '5', title: 'Optimize database queries', priority: 'medium', status: 'done', assignee: 'Alex', dueDate: '2026-04-10' },
  { id: '6', title: 'Deploy staging environment', priority: 'high', status: 'done', assignee: 'Mike' },
];

export default function Dashboard() {
  return (
    <DashboardLayout title="Task Dashboard">
      {/* Stats Row */}
      <section aria-label="Statistics" className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS.map(stat => (
            <StatsWidget key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* Tasks */}
      <section aria-label="Tasks">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Tasks</h2>
          <button className="text-sm text-primary font-medium hover:underline">View all</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {TASKS.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
