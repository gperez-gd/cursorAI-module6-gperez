import { type InputHTMLAttributes } from 'react';

interface SettingsFormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  description?: string;
}

export default function SettingsFormField({ id, label, error, description, className = '', ...inputProps }: SettingsFormFieldProps) {
  const describedBy = [
    description ? `${id}-desc` : '',
    error ? `${id}-error` : '',
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {label}
      </label>
      {description && (
        <p id={`${id}-desc`} className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
      <input
        id={id}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        className={`w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border rounded-lg
          text-gray-900 dark:text-gray-100 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors
          ${error
            ? 'border-red-500 dark:border-red-400'
            : 'border-gray-300 dark:border-gray-600'
          } ${className}`}
        {...inputProps}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
