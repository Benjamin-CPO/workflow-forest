import { useEffect, useState } from "react";
import { ClientProjectsTable } from "./ClientProjectsTable";

interface Project {
  id: number;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  clientId: number;
  status?: 'priority' | null;
}

export const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const parsedProjects = JSON.parse(storedProjects).map((project: Project) => ({
        ...project,
        status: project.status === 'priority' ? 'priority' : null
      }));
      setProjects(parsedProjects);
      localStorage.setItem('projects', JSON.stringify(parsedProjects));
    }
  }, []);

  if (projects.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No projects yet. Create your first project to get started!
      </div>
    );
  }

  return <ClientProjectsTable />;
};