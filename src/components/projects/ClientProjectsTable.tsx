import { Table } from "@/components/ui/table";
import { useState } from "react";
import { DragDropContext } from '@hello-pangea/dnd';
import { useProjectOperations } from "@/hooks/useProjectOperations";
import { ClientFilter } from "./ClientFilter";
import { ProjectTableHeader } from "./ProjectTableHeader";
import { ProjectTableBody } from "./ProjectTableBody";

export const ClientProjectsTable = () => {
  const { projects, clients, updateProjectPriority, deleteProject } = useProjectOperations();
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>(["all"]);

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
      <DragDropContext onDragEnd={updateProjectPriority}>
        <div className="overflow-x-auto">
          <Table className="border-collapse">
            <ProjectTableHeader clients={filteredProjectsByClient} />
            <ProjectTableBody 
              clients={filteredProjectsByClient} 
              onDeleteProject={deleteProject}
            />
          </Table>
        </div>
      </DragDropContext>
    </div>
  );
};