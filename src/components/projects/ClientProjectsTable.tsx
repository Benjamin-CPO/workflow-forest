import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { ProjectCard } from "./ProjectCard";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

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
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="all"
            checked={selectedClientIds.includes("all")}
            onCheckedChange={() => handleClientToggle("all")}
          />
          <label htmlFor="all" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            All Clients
          </label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="no-client"
              checked={selectedClientIds.includes("-1")}
              onCheckedChange={() => handleClientToggle("-1")}
            />
            <label htmlFor="no-client" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              No Client
            </label>
          </div>
          {clients.map((client) => (
            <div key={client.id} className="flex items-center space-x-2">
              <Checkbox
                id={`client-${client.id}`}
                checked={selectedClientIds.includes(client.id.toString())}
                onCheckedChange={() => handleClientToggle(client.id.toString())}
              />
              <label
                htmlFor={`client-${client.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {client.name}
              </label>
            </div>
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
                  className="text-left whitespace-nowrap min-w-[350px] w-[350px]"
                >
                  {client.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="align-top">
              {filteredProjectsByClient.map(({ client, projects }) => (
                <td key={client.id} className="p-4 min-w-[350px] w-[350px]">
                  <div className="space-y-4">
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