interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
}

export default function DateRangePicker({ startDate, endDate, onStartChange, onEndChange }: DateRangePickerProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date Range</span>
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-0.5">
          <label htmlFor="date-start" className="sr-only">Start date</label>
          <input
            id="date-start"
            type="date"
            value={startDate}
            onChange={e => onStartChange(e.target.value)}
            max={endDate || undefined}
            className="text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600
              rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>
        <span className="text-gray-400 text-sm">→</span>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="date-end" className="sr-only">End date</label>
          <input
            id="date-end"
            type="date"
            value={endDate}
            onChange={e => onEndChange(e.target.value)}
            min={startDate || undefined}
            className="text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600
              rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
