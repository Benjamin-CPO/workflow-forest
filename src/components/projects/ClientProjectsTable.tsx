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
}

export const ClientProjectsTable = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>(["all"]);

  useEffect(() => {
    const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    setClients(storedClients);
    setProjects(storedProjects);
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

  const filteredProjectsByClient = selectedClientIds.includes("all")
    ? [
        {
          client: { id: -1, name: "No Client" },
          projects: projects.filter(project => !project.clientId)
        },
        ...clients.map(client => ({
          client,
          projects: projects.filter(project => project.clientId === client.id)
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
            projects: projects.filter(project => project.clientId === client.id)
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
          onValueChange={(value) => handleClientToggle(value)}
          value={selectedClientIds[0]}
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
              {filteredProjectsByClient.map(({ client, projects }) => (
                <td key={client.id} className="p-2 min-w-[250px] w-[250px]">
                  <div className="space-y-2">
                    {projects.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        No projects {client.id === -1 ? 'without client' : 'for this client'}
                      </div>
                    ) : (
                      projects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          {...project}
                        />
                      ))
                    )}
                  </div>
                </td>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};