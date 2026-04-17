import type { RatingStarsProps } from '../../types/product';

const sizeClasses = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

function Star({ filled, half, className }: { filled: boolean; half: boolean; className: string }) {
  if (half) {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id="half-fill">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          fill="url(#half-fill)"
          stroke="currentColor"
          strokeWidth="1.5"
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function RatingStars({ rating, maxRating = 5, size = 'md' }: RatingStarsProps) {
  const clamped = Math.min(Math.max(rating, 0), maxRating);
  const starClass = sizeClasses[size];

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Rating: ${clamped} out of ${maxRating} stars`}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const filled = i < Math.floor(clamped);
        const half = !filled && i < clamped;
        return (
          <span key={i} className={filled || half ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>
            <Star filled={filled} half={half} className={starClass} />
          </span>
        );
      })}
    </div>
  );
}
