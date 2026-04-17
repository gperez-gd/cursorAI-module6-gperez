interface StatProps {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
}

function TrendIcon({ change }: { change: number }) {
  const up = change >= 0;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${up ? 'text-green-600' : 'text-red-500'}`}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
          d={up ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
        />
      </svg>
      {Math.abs(change)}%
    </span>
  );
}

export default function StatsWidget({ label, value, change, icon, color = 'bg-primary/10 text-primary' }: StatProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition-shadow duration-300">
      <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">{value}</p>
        {change !== undefined && (
          <div className="mt-1">
            <TrendIcon change={change} />
          </div>
        )}
      </div>
    </div>
  );
}
