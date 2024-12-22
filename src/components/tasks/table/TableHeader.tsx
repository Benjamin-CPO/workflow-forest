import { TableCell, TableHeader, TableRow } from "@/components/ui/table";

export const TaskTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableCell className="text-left w-[300px]">Title</TableCell>
        <TableCell className="text-left w-[200px]">Status</TableCell>
        <TableCell className="text-left w-[150px]">Due Date</TableCell>
        <TableCell className="text-right w-[100px]">Actions</TableCell>
      </TableRow>
    </TableHeader>
  );
};