import { TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Client } from "@/types/project";

interface ProjectTableHeaderProps {
  clients: { client: Client }[];
}

export const ProjectTableHeader = ({ clients }: ProjectTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        {clients.map(({ client }) => (
          <TableHead 
            key={client.id} 
            className="h-14 min-w-[250px] w-[250px] align-top"
          >
            {client.name}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};