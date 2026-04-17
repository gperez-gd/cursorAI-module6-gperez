export interface ProfileSettings {
  name: string;
  email: string;
  bio: string;
  avatarUrl?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklySummary: boolean;
  marketingEmails: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  dataSharing: boolean;
  activityStatus: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  density: 'comfortable' | 'compact';
  language: string;
}

export interface SettingsState {
  profile: ProfileSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  appearance: AppearanceSettings;
}

export type SettingsTab = 'profile' | 'notifications' | 'privacy' | 'appearance';

export interface SettingsTabDef {
  id: SettingsTab;
  label: string;
  icon: string;
}
