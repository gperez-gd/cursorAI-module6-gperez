import type { NotificationSettings as NotificationSettingsType } from './types';
import SettingsSection from './SettingsSection';
import ToggleSwitch from './ToggleSwitch';

interface NotificationSettingsProps {
  data: NotificationSettingsType;
  onChange: (data: NotificationSettingsType) => void;
}

export default function NotificationSettings({ data, onChange }: NotificationSettingsProps) {
  function update(key: keyof NotificationSettingsType, value: boolean) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="space-y-6">
      <SettingsSection title="Email Notifications" description="Control which emails you receive from us.">
        <ToggleSwitch
          id="notif-email"
          checked={data.emailNotifications}
          onChange={v => update('emailNotifications', v)}
          label="Email notifications"
          description="Receive updates about your account activity via email."
        />
        <ToggleSwitch
          id="notif-weekly"
          checked={data.weeklySummary}
          onChange={v => update('weeklySummary', v)}
          label="Weekly summary"
          description="Get a digest of your weekly activity every Monday."
          disabled={!data.emailNotifications}
        />
        <ToggleSwitch
          id="notif-marketing"
          checked={data.marketingEmails}
          onChange={v => update('marketingEmails', v)}
          label="Marketing emails"
          description="Receive tips, product updates, and offers."
          disabled={!data.emailNotifications}
        />
      </SettingsSection>

      <SettingsSection title="Push Notifications" description="Manage in-app push notification preferences.">
        <ToggleSwitch
          id="notif-push"
          checked={data.pushNotifications}
          onChange={v => update('pushNotifications', v)}
          label="Push notifications"
          description="Receive real-time notifications in the app."
        />
      </SettingsSection>
    </div>
  );
}
