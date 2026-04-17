interface SelectFilterProps {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export default function SelectFilter({ id, label, value, options, onChange }: SelectFilterProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600
          rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
