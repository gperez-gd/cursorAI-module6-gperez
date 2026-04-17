import type { Author } from './types';

const BG_COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];

function getBg(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return BG_COLORS[Math.abs(h) % BG_COLORS.length];
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

interface UserAvatarProps {
  author: Author;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };

export default function UserAvatar({ author, size = 'md' }: UserAvatarProps) {
  const cls = `${sizes[size]} rounded-full flex items-center justify-center font-bold text-white shrink-0`;

  if (author.avatarUrl) {
    return (
      <img
        src={author.avatarUrl}
        alt={`${author.name}'s avatar`}
        className={`${cls} object-cover`}
      />
    );
  }

  return (
    <div className={`${cls} ${getBg(author.id)}`} aria-hidden="true">
      {getInitials(author.name)}
    </div>
  );
}
