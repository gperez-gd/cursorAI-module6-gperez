import type { PrivacySettings as PrivacySettingsType } from './types';
import SettingsSection from './SettingsSection';
import ToggleSwitch from './ToggleSwitch';
import SelectDropdown from './SelectDropdown';

interface PrivacySettingsProps {
  data: PrivacySettingsType;
  onChange: (data: PrivacySettingsType) => void;
}

const visibilityOptions = [
  { value: 'public', label: 'Public — Anyone can view your profile' },
  { value: 'private', label: 'Private — Only approved followers can view' },
];

export default function PrivacySettings({ data, onChange }: PrivacySettingsProps) {
  return (
    <div className="space-y-6">
      <SettingsSection title="Profile Visibility" description="Control who can see your profile and content.">
        <SelectDropdown
          id="privacy-visibility"
          label="Profile visibility"
          value={data.profileVisibility}
          options={visibilityOptions}
          onChange={v => onChange({ ...data, profileVisibility: v as 'public' | 'private' })}
        />
      </SettingsSection>

      <SettingsSection title="Data & Activity" description="Manage how your data and activity are used.">
        <ToggleSwitch
          id="privacy-data-sharing"
          checked={data.dataSharing}
          onChange={v => onChange({ ...data, dataSharing: v })}
          label="Anonymised data sharing"
          description="Help improve the product by sharing anonymised usage data."
        />
        <ToggleSwitch
          id="privacy-activity"
          checked={data.activityStatus}
          onChange={v => onChange({ ...data, activityStatus: v })}
          label="Show activity status"
          description="Let others see when you were last active."
        />
      </SettingsSection>
    </div>
  );
}
