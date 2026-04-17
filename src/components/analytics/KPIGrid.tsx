import type { KPIData } from './types';
import KPICard from './KPICard';
import { KPISkeleton } from './LoadingSkeleton';

interface KPIGridProps {
  data: KPIData[];
  loading: boolean;
}

export default function KPIGrid({ data, loading }: KPIGridProps) {
  return (
    <section aria-label="Key performance indicators">
      <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Key Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <KPISkeleton key={i} />)
          : data.map(kpi => <KPICard key={kpi.id} data={kpi} />)
        }
      </div>
    </section>
  );
}
