import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const TaskTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[300px]">Title</TableHead>
        <TableHead className="w-[200px]">Status</TableHead>
        <TableHead className="w-[200px]">Assignee</TableHead>
        <TableHead className="w-[150px]">Due Date</TableHead>
        <TableHead className="w-[100px] text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};