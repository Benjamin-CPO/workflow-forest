import { TableBody, TableRow } from "@/components/ui/table";
import { Client, Project } from "@/types/project";
import { ProjectColumn } from "./ProjectColumn";

interface ProjectTableBodyProps {
  clients: {
    client: Client;
    projects: Project[];
  }[];
}

export const ProjectTableBody = ({ clients }: ProjectTableBodyProps) => {
  return (
    <TableBody>
      <TableRow className="align-top">
        {clients.map(({ client, projects: clientProjects }) => (
          <ProjectColumn
            key={client.id}
            client={client}
            projects={clientProjects}
          />
        ))}
      </TableRow>
    </TableBody>
  );
};