import { ProjectList } from "@/components/projects/ProjectList";

const Dashboard = () => {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">Manage and track your active projects</p>
      </div>
      <ProjectList />
    </div>
  );
};

export default Dashboard;