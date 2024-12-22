import { TableCell, TableHeader, TableRow } from "@/components/ui/table";

export const TaskTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableCell className="w-[300px] font-medium">Title</TableCell>
        <TableCell className="w-[200px] font-medium">Status</TableCell>
        <TableCell className="w-[150px] font-medium">Due Date</TableCell>
        <TableCell className="w-[100px] text-right font-medium">Actions</TableCell>
      </TableRow>
    </TableHeader>
  );
};