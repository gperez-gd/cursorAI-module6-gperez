import { useState, useCallback } from 'react';
import type { SettingsState, SettingsTab } from './types';
import SettingsTabs from './SettingsTabs';
import ProfileSettings from './ProfileSettings';
import NotificationSettings from './NotificationSettings';
import PrivacySettings from './PrivacySettings';
import AppearanceSettings from './AppearanceSettings';

const STORAGE_KEY = 'app_settings';

const DEFAULT_SETTINGS: SettingsState = {
  profile: { name: 'Alex Johnson', email: 'alex@example.com', bio: '' },
  notifications: { emailNotifications: true, pushNotifications: false, weeklySummary: true, marketingEmails: false },
  privacy: { profileVisibility: 'public', dataSharing: false, activityStatus: true },
  appearance: { theme: 'light', density: 'comfortable', language: 'en' },
};

function loadSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } as SettingsState;
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(s: SettingsState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [settings, setSettings] = useState<SettingsState>(loadSettings);
  const [savedSettings, setSavedSettings] = useState<SettingsState>(loadSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isDirty = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const updateSettings = useCallback(<K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  async function handleSave() {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    saveSettings(settings);
    setSavedSettings(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    setSettings(savedSettings);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
      <div className="px-6 pt-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Settings</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Manage your account preferences.</p>
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="p-6">
        <div
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
          className="focus:outline-none"
        >
          {activeTab === 'profile' && (
            <ProfileSettings data={settings.profile} onChange={v => updateSettings('profile', v)} />
          )}
          {activeTab === 'notifications' && (
            <NotificationSettings data={settings.notifications} onChange={v => updateSettings('notifications', v)} />
          )}
          {activeTab === 'privacy' && (
            <PrivacySettings data={settings.privacy} onChange={v => updateSettings('privacy', v)} />
          )}
          {activeTab === 'appearance' && (
            <AppearanceSettings data={settings.appearance} onChange={v => updateSettings('appearance', v)} />
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleReset}
            disabled={!isDirty || saving}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400
              bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved!
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!isDirty || saving}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg
                hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving…
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
