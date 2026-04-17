import DashboardLayout from '../components/dashboard/DashboardLayout';
import KanbanBoard from '../components/kanban/KanbanBoard';

export default function Kanban() {
  return (
    <DashboardLayout title="Kanban Board">
      <div className="h-full -m-4 sm:-m-6">
        <KanbanBoard />
      </div>
    </DashboardLayout>
  );
}
