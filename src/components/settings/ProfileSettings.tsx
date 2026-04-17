import { useState } from 'react';
import type { ProfileSettings as ProfileSettingsType } from './types';
import SettingsSection from './SettingsSection';
import SettingsFormField from './SettingsFormField';

interface ProfileSettingsProps {
  data: ProfileSettingsType;
  onChange: (data: ProfileSettingsType) => void;
}

function validateEmail(email: string): string | undefined {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
  return undefined;
}

export default function ProfileSettings({ data, onChange }: ProfileSettingsProps) {
  const [emailError, setEmailError] = useState<string | undefined>();

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setEmailError(validateEmail(val));
    onChange({ ...data, email: val });
  }

  return (
    <div className="space-y-6">
      <SettingsSection title="Profile Information" description="Update your name, email, and public profile details.">
        <SettingsFormField
          id="profile-name"
          label="Full Name"
          type="text"
          value={data.name}
          onChange={e => onChange({ ...data, name: e.target.value })}
          placeholder="Your full name"
          required
        />
        <SettingsFormField
          id="profile-email"
          label="Email Address"
          type="email"
          value={data.email}
          onChange={handleEmailChange}
          error={emailError}
          placeholder="you@example.com"
          required
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-bio" className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Bio
          </label>
          <textarea
            id="profile-bio"
            value={data.bio}
            onChange={e => onChange({ ...data, bio: e.target.value })}
            rows={3}
            maxLength={200}
            placeholder="Tell us a little about yourself…"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600
              rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
          />
          <p className="text-xs text-gray-400 text-right">{data.bio.length}/200</p>
        </div>
      </SettingsSection>

      <SettingsSection title="Avatar" description="Upload a profile picture (JPG, PNG — max 2 MB).">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 text-primary font-bold text-2xl flex items-center justify-center shrink-0">
            {data.name ? data.name[0].toUpperCase() : '?'}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg
                hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload photo
            </label>
            <input id="avatar-upload" type="file" accept="image/*" className="sr-only" aria-label="Upload avatar" />
            <p className="text-xs text-gray-400">Or enter URL below</p>
            <SettingsFormField
              id="avatar-url"
              label=""
              type="url"
              value={data.avatarUrl ?? ''}
              onChange={e => onChange({ ...data, avatarUrl: e.target.value || undefined })}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
