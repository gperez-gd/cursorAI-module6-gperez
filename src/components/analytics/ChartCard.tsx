import type { ChartData } from './types';
import ChartPlaceholder from './ChartPlaceholder';
import { ChartSkeleton } from './LoadingSkeleton';

interface ChartCardProps {
  data: ChartData;
  loading: boolean;
}

export default function ChartCard({ data, loading }: ChartCardProps) {
  if (loading) return <ChartSkeleton />;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300"
      aria-label={`Chart: ${data.title}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{data.title}</h3>
        <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full capitalize">
          {data.type}
        </span>
      </div>
      <ChartPlaceholder data={data} />
      {/* Legend */}
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 text-center italic">
        Visual-only preview — connect a real chart library for production
      </p>
    </div>
  );
}
