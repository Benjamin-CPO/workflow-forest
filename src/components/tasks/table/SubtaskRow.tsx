import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { TaskStatusSelect } from "@/components/TaskStatusSelect";
import { SubTask } from "@/types/project";

interface SubtaskRowProps {
  subtask: SubTask;
  taskId: number;
  onStatusChange: (taskId: number, subtaskId: number, newStatus: string) => void;
  onDelete: (taskId: number, subtaskId: number) => void;
}

export const SubtaskRow = ({
  subtask,
  taskId,
  onStatusChange,
  onDelete,
}: SubtaskRowProps) => {
  return (
    <TableRow className="group">
      <TableCell className="w-[300px] pl-10">
        <span className="truncate">{subtask.title}</span>
      </TableCell>
      <TableCell className="w-[200px]">
        <TaskStatusSelect
          status={subtask.status}
          onStatusChange={(newStatus) =>
            onStatusChange(taskId, subtask.id, newStatus)
          }
        />
      </TableCell>
      <TableCell className="w-[150px]"></TableCell>
      <TableCell className="w-[100px] text-right">
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(taskId, subtask.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};