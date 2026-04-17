import DashboardLayout from '../components/dashboard/DashboardLayout';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';

export default function Analytics() {
  return (
    <DashboardLayout title="Analytics">
      <AnalyticsDashboard />
    </DashboardLayout>
  );
}
