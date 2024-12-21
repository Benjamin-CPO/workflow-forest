import { ProjectCard } from "./ProjectCard";
import { useEffect, useState } from "react";

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
    // Get projects from localStorage and convert old status format to new one
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const parsedProjects = JSON.parse(storedProjects).map((project: Project) => ({
        ...project,
        status: project.status === 'priority' ? 'priority' : null
      }));
      setProjects(parsedProjects);
      // Update localStorage with the new format
      localStorage.setItem('projects', JSON.stringify(parsedProjects));
    }
  }, []);

  const handleDeleteProject = (id: number) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  if (projects.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No projects yet. Create your first project to get started!
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          {...project} 
          onDelete={handleDeleteProject}
        />
      ))}
    </div>
  );
};