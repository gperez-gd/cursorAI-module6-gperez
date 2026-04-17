import type { Assignee } from './types';

const COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];

function getColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

interface AssigneeAvatarProps {
  assignees: Assignee[];
  max?: number;
}

export default function AssigneeAvatar({ assignees, max = 3 }: AssigneeAvatarProps) {
  const visible = assignees.slice(0, max);
  const overflow = assignees.length - max;

  return (
    <div className="flex items-center -space-x-1.5" aria-label={`Assigned to: ${assignees.map(a => a.name).join(', ')}`}>
      {visible.map(a => (
        <div
          key={a.id}
          title={a.name}
          className={`w-6 h-6 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center text-[10px] font-bold text-white ${getColor(a.id)}`}
        >
          {a.avatarUrl ? (
            <img src={a.avatarUrl} alt={a.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(a.name)
          )}
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
          +{overflow}
        </div>
      )}
    </div>
  );
}
