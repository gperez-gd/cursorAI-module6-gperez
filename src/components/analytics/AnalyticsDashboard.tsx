import { useState, useEffect } from 'react';
import type { FiltersState, KPIData, TableRow, ChartData } from './types';
import KPIGrid from './KPIGrid';
import ChartCard from './ChartCard';
import FiltersBar from './FiltersBar';
import DataTable from './DataTable';

const DEFAULT_FILTERS: FiltersState = {
  startDate: '2026-01-01',
  endDate: '2026-04-16',
  category: '',
  status: 'all',
};

const KPI_DATA: KPIData[] = [
  { id: '1', label: 'Total Revenue', value: '$84,251', change: 12.4, icon: '💰', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  { id: '2', label: 'Active Users', value: '12,843', change: 8.1, icon: '👥', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: '3', label: 'Conversion Rate', value: '3.24', unit: '%', change: -1.2, icon: '📈', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: '4', label: 'Avg. Order Value', value: '$127', change: 5.7, icon: '🛒', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
];

const CHART_DATA: ChartData[] = [
  {
    title: 'Monthly Revenue', type: 'line',
    data: [
      { label: 'Jan', value: 52000 }, { label: 'Feb', value: 61000 }, { label: 'Mar', value: 58000 },
      { label: 'Apr', value: 74000 }, { label: 'May', value: 69000 }, { label: 'Jun', value: 84000 },
    ],
  },
  {
    title: 'Sales by Category', type: 'bar',
    data: [
      { label: 'Elec', value: 42 }, { label: 'Clothing', value: 28 }, { label: 'Food', value: 18 }, { label: 'Svc', value: 12 },
    ],
  },
  {
    title: 'Traffic Sources', type: 'pie',
    data: [
      { label: 'Organic', value: 45 }, { label: 'Direct', value: 25 }, { label: 'Social', value: 20 }, { label: 'Email', value: 10 },
    ],
  },
  {
    title: 'Daily Active Users', type: 'line',
    data: [
      { label: 'Mon', value: 1200 }, { label: 'Tue', value: 1900 }, { label: 'Wed', value: 1700 },
      { label: 'Thu', value: 2100 }, { label: 'Fri', value: 1800 }, { label: 'Sat', value: 900 }, { label: 'Sun', value: 800 },
    ],
  },
];

const ALL_ROWS: TableRow[] = [
  { id: '1', name: 'MacBook Pro 16"', category: 'electronics', status: 'active', revenue: 24999, change: 15.2, date: '2026-04-10' },
  { id: '2', name: 'Winter Jacket', category: 'clothing', status: 'active', revenue: 8400, change: -3.1, date: '2026-04-08' },
  { id: '3', name: 'Organic Coffee', category: 'food', status: 'inactive', revenue: 3200, change: 2.8, date: '2026-04-05' },
  { id: '4', name: 'iPhone 17 Pro', category: 'electronics', status: 'active', revenue: 19800, change: 22.4, date: '2026-04-12' },
  { id: '5', name: 'Cloud Hosting', category: 'services', status: 'active', revenue: 5500, change: 8.6, date: '2026-04-09' },
  { id: '6', name: 'Running Shoes', category: 'clothing', status: 'active', revenue: 6750, change: 11.3, date: '2026-04-11' },
  { id: '7', name: 'Espresso Machine', category: 'food', status: 'inactive', revenue: 2100, change: -8.5, date: '2026-04-06' },
  { id: '8', name: 'Consulting Plan', category: 'services', status: 'active', revenue: 12000, change: 4.2, date: '2026-04-13' },
];

export default function AnalyticsDashboard() {
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<TableRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (cancelled) return;
      const filtered = ALL_ROWS.filter(row => {
        if (filters.category && row.category !== filters.category) return false;
        if (filters.status !== 'all' && row.status !== filters.status) return false;
        return true;
      });
      setRows(filtered);
      setLoading(false);
    }
    void run();
    return () => { cancelled = true; };
  }, [filters]);

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="space-y-6">
      <FiltersBar filters={filters} onChange={setFilters} onReset={handleReset} loading={loading} />
      <KPIGrid data={KPI_DATA} loading={loading} />

      <section aria-label="Charts">
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Visualizations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CHART_DATA.map((chart, i) => (
            <ChartCard key={i} data={chart} loading={loading} />
          ))}
        </div>
      </section>

      <DataTable rows={rows} loading={loading} />
    </div>
  );
}
