import { useState, useEffect } from "react";
import { Project, Client } from "@/types/project";
import { toast } from "sonner";

export const useProjectOperations = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    const projectsWithOrder = storedProjects
      .filter((project: any): project is Project => {
        return project && typeof project.id === 'number';
      })
      .map((project: Project, index: number) => ({
        ...project,
        order: project.order ?? index,
        status: project.status === 'priority' ? 'priority' as const : null
      }));

    const updatedProjects = projectsWithOrder.map((project: Project) => {
      const clientProjects = projectsWithOrder.filter(p => p.clientId === project.clientId);
      if (clientProjects.length === 1) {
        return { ...project, status: 'priority' as const };
      }
      return project;
    });

    setClients(storedClients);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  }, []);

  const updateProjectPriority = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const clientId = parseInt(source.droppableId);
    
    const updatedProjects = [...projects];
    const clientProjects = updatedProjects.filter(p => p.clientId === clientId);
    const otherProjects = updatedProjects.filter(p => p.clientId !== clientId);

    const [reorderedProject] = clientProjects.splice(source.index, 1);
    clientProjects.splice(destination.index, 0, reorderedProject);

    const updatedClientProjects = clientProjects.map((project, index) => ({
      ...project,
      order: index,
      status: index === 0 ? ('priority' as const) : null
    }));

    const finalProjects = [...otherProjects, ...updatedClientProjects];
    setProjects(finalProjects);
    localStorage.setItem('projects', JSON.stringify(finalProjects));
    
    if (source.index !== destination.index) {
      toast.success("Project priority updated");
    }
  };

  return {
    projects,
    clients,
    updateProjectPriority
  };
};