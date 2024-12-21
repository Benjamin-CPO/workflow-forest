import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { DragDropContext } from '@hello-pangea/dnd';
import { toast } from "sonner";
import { Client, Project, Task } from "@/types/project";
import { ClientFilter } from "./ClientFilter";
import { ProjectColumn } from "./ProjectColumn";

export const ClientProjectsTable = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>(["all"]);

  useEffect(() => {
    const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
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
    setTasks(storedTasks);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  }, []);

  const handleClientToggle = (clientId: string) => {
    setSelectedClientIds(prev => {
      if (clientId === "all") {
        return ["all"];
      }
      
      const newSelection = prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev.filter(id => id !== "all"), clientId];
      
      return newSelection.length === 0 ? ["all"] : newSelection;
    });
  };

  const onDragEnd = (result: any) => {
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

  const getProjectTasks = (projectId: number) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const filteredProjectsByClient = selectedClientIds.includes("all")
    ? [
        {
          client: { id: -1, name: "No Client" },
          projects: projects.filter(project => !project.clientId)
        },
        ...clients.map(client => ({
          client,
          projects: projects
            .filter(project => project.clientId === client.id)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
        }))
      ]
    : [
        ...(selectedClientIds.includes("-1")
          ? [{
              client: { id: -1, name: "No Client" },
              projects: projects.filter(project => !project.clientId)
            }]
          : []),
        ...clients
          .filter(client => selectedClientIds.includes(client.id.toString()))
          .map(client => ({
            client,
            projects: projects
              .filter(project => project.clientId === client.id)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
          }))
      ];

  if (clients.length === 0 && projects.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No clients yet. Add a client to start creating projects!
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ClientFilter 
        clients={clients}
        selectedClientIds={selectedClientIds}
        onClientToggle={handleClientToggle}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {filteredProjectsByClient.map(({ client }) => (
                  <TableHead 
                    key={client.id} 
                    className="text-left whitespace-nowrap min-w-[250px] w-[250px]"
                  >
                    {client.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="align-top">
                {filteredProjectsByClient.map(({ client, projects: clientProjects }) => (
                  <ProjectColumn
                    key={client.id}
                    client={client}
                    projects={clientProjects}
                  />
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DragDropContext>
    </div>
  );
};
