import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectList } from "@/components/projects/ProjectList";
import { AddProjectDialog } from "@/components/projects/AddProjectDialog";

const Dashboard = () => {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">Manage and track your active projects</p>
          </div>
          <AddProjectDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </AddProjectDialog>
        </div>
      </div>
      <ProjectList />
    </div>
  );
};

export default Dashboard;