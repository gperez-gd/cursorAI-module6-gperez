import DashboardLayout from '../components/dashboard/DashboardLayout';
import SettingsPanel from '../components/settings/SettingsPanel';

export default function Settings() {
  return (
    <DashboardLayout title="Settings">
      <div className="max-w-3xl mx-auto">
        <SettingsPanel />
      </div>
    </DashboardLayout>
  );
}
