import type { ChartData } from './types';

interface ChartPlaceholderProps {
  data: ChartData;
}

function BarChart({ data: chartData }: { data: ChartData }) {
  const max = Math.max(...chartData.data.map(d => d.value), 1);

  return (
    <div className="flex items-end gap-1.5 h-32" aria-hidden="true">
      {chartData.data.map((point, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-primary/80 dark:bg-primary/60 rounded-t-sm hover:bg-primary transition-colors"
            style={{ height: `${(point.value / max) * 100}%`, minHeight: '4px' }}
          />
          <span className="text-xs text-gray-400 dark:text-gray-500 truncate w-full text-center">{point.label}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data: chartData }: { data: ChartData }) {
  const max = Math.max(...chartData.data.map(d => d.value), 1);
  const min = Math.min(...chartData.data.map(d => d.value));
  const range = max - min || 1;
  const W = 300;
  const H = 120;
  const pts = chartData.data.map((d, i) => ({
    x: (i / (chartData.data.length - 1)) * W,
    y: H - ((d.value - min) / range) * H,
  }));

  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `M ${pts[0].x} ${H} ${path} L ${pts[pts.length - 1].x} ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="rgb(59 130 246)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#line-gradient)" />
      <path d={path} fill="none" stroke="rgb(59 130 246)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="rgb(59 130 246)" />
      ))}
    </svg>
  );
}

function PieChart({ data: chartData }: { data: ChartData }) {
  const total = chartData.data.reduce((s, d) => s + d.value, 0) || 1;
  const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  const slices = chartData.data.reduce<{ start: number; end: number; value: number }[]>((acc, d) => {
    const prev = acc[acc.length - 1];
    const start = prev ? prev.end : 0;
    const end = start + (d.value / total) * 2 * Math.PI;
    return [...acc, { start, end, value: d.value }];
  }, []);

  return (
    <div className="flex items-center gap-6" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="w-28 h-28 shrink-0 -rotate-90">
        {slices.map((slice, i) => {
          const start = slice.start;
          const end = slice.end;
          const x1 = 50 + 40 * Math.cos(start);
          const y1 = 50 + 40 * Math.sin(start);
          const x2 = 50 + 40 * Math.cos(end);
          const y2 = 50 + 40 * Math.sin(end);
          const largeArc = end - start > Math.PI ? 1 : 0;
          return (
            <path
              key={i}
              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={colors[i % colors.length]}
            />
          );
        })}
      </svg>
      <div className="flex flex-col gap-1.5 min-w-0">
        {chartData.data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="text-gray-600 dark:text-gray-400 truncate">{d.label}</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200 ml-auto">{Math.round((d.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChartPlaceholder({ data }: ChartPlaceholderProps) {
  return (
    <div>
      {data.type === 'bar' && <BarChart data={data} />}
      {data.type === 'line' && <LineChart data={data} />}
      {data.type === 'pie' && <PieChart data={data} />}
    </div>
  );
}
