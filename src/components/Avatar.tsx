import type { AvatarProps } from '../types/user';

const sizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-16 h-16 text-xl',
  lg: 'w-24 h-24 text-3xl',
  xl: 'w-32 h-32 text-4xl',
};

export default function Avatar({ src, alt, size = 'lg' }: AvatarProps) {
  const initials = alt
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-bold flex-shrink-0 ring-4 ring-white shadow-md`}
      role="img"
      aria-label={alt}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
}
