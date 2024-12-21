import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { ProjectCard } from "./ProjectCard";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    setClients(storedClients);
    setProjects(storedProjects);
  }, []);

  const projectsByClient = clients.map(client => ({
    client,
    projects: projects.filter(project => project.clientId === client.id)
  }));

  if (clients.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No clients yet. Add a client to start creating projects!
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Table>
        <TableHeader>
          <TableRow>
            {clients.map((client) => (
              <TableHead key={client.id} className="text-left">
                {client.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="align-top">
            {projectsByClient.map(({ client, projects }) => (
              <td key={client.id} className="p-4">
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No projects for this client
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
  );
};