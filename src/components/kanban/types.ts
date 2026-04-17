export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type ColumnId = string;

export interface Assignee {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  assignees: Assignee[];
  dueDate?: string;
  columnId: ColumnId;
  createdAt: string;
  order: number;
  tags?: string[];
}

export interface Column {
  id: ColumnId;
  title: string;
  color?: string;
  taskLimit?: number;
}

export interface BoardState {
  columns: Column[];
  tasks: Task[];
}

export interface FilterState {
  search: string;
  priorities: Priority[];
  assigneeId: string;
  overdueOnly: boolean;
}

export const BOARD_STORAGE_KEY = 'kanban_board_state';
export const BOARD_VERSION_KEY = 'kanban_board_version';
export const BOARD_VERSION = '1';

export const ACCENT_COLORS = [
  '#3b82f6', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16',
];

export const DEFAULT_COLUMNS: Column[] = [
  { id: 'col-todo', title: 'To Do', color: '#3b82f6' },
  { id: 'col-inprogress', title: 'In Progress', color: '#f59e0b', taskLimit: 5 },
  { id: 'col-review', title: 'In Review', color: '#8b5cf6', taskLimit: 3 },
  { id: 'col-done', title: 'Done', color: '#22c55e' },
];

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated builds and deployments.',
    priority: 'high', assignees: [{ id: 'tm1', name: 'Alex Johnson' }],
    dueDate: '2026-04-25', columnId: 'col-todo', createdAt: new Date().toISOString(), order: 0, tags: ['devops', 'infra'],
  },
  {
    id: 'task-2', title: 'Design system tokens', description: 'Define color, spacing, and typography tokens for the design system.',
    priority: 'medium', assignees: [{ id: 'tm2', name: 'Sarah Chen' }],
    dueDate: '2026-04-30', columnId: 'col-todo', createdAt: new Date().toISOString(), order: 1, tags: ['design'],
  },
  {
    id: 'task-3', title: 'Implement auth flow', description: 'JWT-based authentication with refresh tokens.',
    priority: 'critical', assignees: [{ id: 'tm3', name: 'Mike Rodriguez' }, { id: 'tm1', name: 'Alex Johnson' }],
    dueDate: '2026-04-18', columnId: 'col-inprogress', createdAt: new Date().toISOString(), order: 0, tags: ['security', 'backend'],
  },
  {
    id: 'task-4', title: 'Dashboard analytics charts', priority: 'medium',
    assignees: [{ id: 'tm4', name: 'Jane Williams' }], columnId: 'col-inprogress',
    createdAt: new Date().toISOString(), order: 1,
  },
  {
    id: 'task-5', title: 'Code review: product card', priority: 'low',
    assignees: [{ id: 'tm5', name: 'David Kim' }], dueDate: '2026-04-17',
    columnId: 'col-review', createdAt: new Date().toISOString(), order: 0,
  },
  {
    id: 'task-6', title: 'Write unit tests for utils', priority: 'medium',
    assignees: [{ id: 'tm6', name: 'Emma Davis' }], columnId: 'col-done',
    createdAt: new Date().toISOString(), order: 0,
  },
];
