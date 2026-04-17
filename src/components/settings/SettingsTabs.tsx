import type { SettingsTab, SettingsTabDef } from './types';

const TABS: SettingsTabDef[] = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'privacy', label: 'Privacy', icon: '🔒' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
];

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Settings sections"
      className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 gap-1 pb-0 -mb-px"
    >
      {TABS.map(tab => (
        <button
          key={tab.id}
          role="tab"
          id={`tab-${tab.id}`}
          aria-selected={activeTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
            border-b-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset
            ${activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
        >
          <span aria-hidden="true">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
