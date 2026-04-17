import { useEffect } from 'react';
import type { AppearanceSettings as AppearanceSettingsType } from './types';
import SettingsSection from './SettingsSection';
import SelectDropdown from './SelectDropdown';

interface AppearanceSettingsProps {
  data: AppearanceSettingsType;
  onChange: (data: AppearanceSettingsType) => void;
}

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System default' },
];

const densityOptions = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
];

function applyTheme(theme: 'light' | 'dark' | 'system') {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'light') {
    root.classList.remove('dark');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  }
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // ignore
  }
}

export default function AppearanceSettings({ data, onChange }: AppearanceSettingsProps) {
  useEffect(() => {
    applyTheme(data.theme);
  }, [data.theme]);

  return (
    <div className="space-y-6">
      <SettingsSection title="Theme" description="Choose your preferred color scheme.">
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...data, theme: opt.value as AppearanceSettingsType['theme'] })}
              aria-pressed={data.theme === opt.value}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                ${data.theme === opt.value
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
            >
              <div className={`w-8 h-8 rounded-lg ${
                opt.value === 'dark' ? 'bg-gray-900' :
                opt.value === 'light' ? 'bg-white border border-gray-200' :
                'bg-gradient-to-br from-white to-gray-900'
              }`} aria-hidden="true" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{opt.label}</span>
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Layout Density" description="Control spacing and component sizing.">
        <SelectDropdown
          id="appearance-density"
          label="Density"
          value={data.density}
          options={densityOptions}
          onChange={v => onChange({ ...data, density: v as AppearanceSettingsType['density'] })}
        />
      </SettingsSection>

      <SettingsSection title="Language" description="Select your preferred display language.">
        <SelectDropdown
          id="appearance-language"
          label="Language"
          value={data.language}
          options={languageOptions}
          onChange={v => onChange({ ...data, language: v })}
        />
      </SettingsSection>
    </div>
  );
}
