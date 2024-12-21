import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { ProjectCard } from "./ProjectCard";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from "sonner";

interface Client {
  id: number;
  name: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  clientId: number;
  status?: 'priority' | null;
  order?: number;
}

export const ClientProjectsTable = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>(["all"]);

  useEffect(() => {
    const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    // Initialize projects with order if not present and ensure correct status type
    const projectsWithOrder = storedProjects
      .filter((project: any): project is Project => {
        return project && typeof project.id === 'number';
      })
      .map((project: Project, index: number) => ({
        ...project,
        order: project.order ?? index,
        status: project.status === 'priority' ? 'priority' as const : null
      }));

    // Set priority for single projects
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

    // Reorder client projects
    const [reorderedProject] = clientProjects.splice(source.index, 1);
    clientProjects.splice(destination.index, 0, reorderedProject);

    // Update priority based on order
    const updatedClientProjects = clientProjects.map((project, index) => ({
      ...project,
      order: index,
      status: index === 0 ? ('priority' as const) : null
    }));

    // Combine and save
    const finalProjects = [...otherProjects, ...updatedClientProjects];
    setProjects(finalProjects);
    localStorage.setItem('projects', JSON.stringify(finalProjects));
    
    if (source.index !== destination.index) {
      toast.success("Project priority updated");
    }
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
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Filter by Client</label>
        <Select
          value={selectedClientIds[0]}
          onValueChange={handleClientToggle}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select clients" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[200px]">
              <SelectItem value="all">All Clients</SelectItem>
              <SelectItem value="-1">No Client</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.name}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-2">
          {selectedClientIds.map((id) => (
            <Badge 
              key={id} 
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleClientToggle(id)}
            >
              {id === "all" 
                ? "All Clients" 
                : id === "-1" 
                  ? "No Client" 
                  : clients.find(c => c.id.toString() === id)?.name}
              ×
            </Badge>
          ))}
        </div>
      </div>
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
                  <td key={client.id} className="p-2 min-w-[250px] w-[250px]">
                    <Droppable droppableId={client.id.toString()}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-2"
                        >
                          {clientProjects.length === 0 ? (
                            <div className="text-sm text-muted-foreground">
                              No projects {client.id === -1 ? 'without client' : 'for this client'}
                            </div>
                          ) : (
                            clientProjects
                              .filter((project): project is Project => 
                                project !== undefined && project !== null && typeof project.id === 'number'
                              )
                              .map((project, index) => (
                                <Draggable
                                  key={project.id}
                                  draggableId={project.id.toString()}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <ProjectCard {...project} />
                                    </div>
                                  )}
                                </Draggable>
                              ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </td>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DragDropContext>
    </div>
  );
};