import { useState } from 'react';
import type { TableRow } from './types';
import { TableRowSkeleton } from './LoadingSkeleton';

interface DataTableProps {
  rows: TableRow[];
  loading: boolean;
}

type SortKey = keyof TableRow;
type SortDir = 'asc' | 'desc';

export default function DataTable({ rows, loading }: DataTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('revenue');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
    const cmp = typeof va === 'number' ? va - (vb as number) : String(va).localeCompare(String(vb));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) {
      return <svg className="w-3.5 h-3.5 text-gray-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5-5 5 5H7zM7 14l5 5 5-5H7z" /></svg>;
    }
    return (
      <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d={sortDir === 'asc' ? 'M7 14l5-5 5 5H7z' : 'M7 10l5 5 5-5H7z'} />
      </svg>
    );
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'change', label: 'Change' },
    { key: 'date', label: 'Date' },
  ];

  return (
    <section aria-label="Data table" className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Detailed Data</h3>
        <span className="text-xs text-gray-400">{rows.length} records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              {columns.map(col => (
                <th
                  key={col.key}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                >
                  <button
                    onClick={() => handleSort(col.key)}
                    className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    aria-label={`Sort by ${col.label}`}
                  >
                    {col.label}
                    <SortIcon col={col.key} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 dark:text-gray-500">
                  No data found for the selected filters.
                </td>
              </tr>
            ) : (
              sorted.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{row.name}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 capitalize">{row.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      row.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100 font-medium">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(row.revenue)}
                  </td>
                  <td className={`px-4 py-3 font-medium ${row.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {row.change >= 0 ? '+' : ''}{row.change}%
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{row.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
