import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { TaskStatusSelect } from "@/components/TaskStatusSelect";
import { SubtaskRowProps } from "../types/table";

export const SubtaskRow = ({ 
  subtask, 
  taskId, 
  onStatusChange, 
  onDelete 
}: SubtaskRowProps) => {
  return (
    <TableRow className="bg-muted/30">
      <TableCell className="pl-10">{subtask.title}</TableCell>
      <TableCell>
        <TaskStatusSelect
          status={subtask.status}
          onStatusChange={(value) => onStatusChange(taskId, subtask.id, value)}
        />
      </TableCell>
      <TableCell></TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onDelete(taskId, subtask.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};