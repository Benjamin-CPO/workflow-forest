import { ProjectCard } from "./ProjectCard";
import { useEffect, useState } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
}

export const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Get projects from localStorage
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

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
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
};