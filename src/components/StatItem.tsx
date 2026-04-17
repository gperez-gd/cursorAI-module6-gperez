import type { StatItemProps } from '../types/user';

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-0.5" role="group" aria-label={`${label}: ${value}`}>
      <span className="text-xl font-bold text-gray-900 sm:text-2xl">
        {formatNumber(value)}
      </span>
      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
        {label}
      </span>
    </div>
  );
}
