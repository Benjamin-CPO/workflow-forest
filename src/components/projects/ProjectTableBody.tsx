import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Client, Project } from "@/types/project";
import { ProjectColumn } from "./ProjectColumn";

interface ProjectTableBodyProps {
  clients: {
    client: Client;
    projects: Project[];
  }[];
  onDeleteProject: (projectId: number) => void;
}

export const ProjectTableBody = ({ clients, onDeleteProject }: ProjectTableBodyProps) => {
  return (
    <TableBody>
      <TableRow>
        {clients.map(({ client, projects: clientProjects }) => (
          <TableCell 
            key={client.id} 
            className="align-top min-w-[250px] w-[250px] p-0"
          >
            <ProjectColumn
              client={client}
              projects={clientProjects}
              onDeleteProject={onDeleteProject}
            />
          </TableCell>
        ))}
      </TableRow>
    </TableBody>
  );
};