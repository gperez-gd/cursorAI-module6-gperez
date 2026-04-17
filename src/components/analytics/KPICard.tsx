import type { KPIData } from './types';

interface KPICardProps {
  data: KPIData;
}

export default function KPICard({ data }: KPICardProps) {
  const up = data.change >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start gap-4">
        <div className={`${data.color} w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0`}>
          {data.icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{data.label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">
            {data.value}
            {data.unit && <span className="text-sm font-normal text-gray-500 ml-1">{data.unit}</span>}
          </p>
          <div className={`flex items-center gap-1 mt-1 text-sm font-medium ${up ? 'text-green-600' : 'text-red-500'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d={up ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
              />
            </svg>
            <span>{Math.abs(data.change)}% vs last period</span>
          </div>
        </div>
      </div>
    </div>
  );
}
