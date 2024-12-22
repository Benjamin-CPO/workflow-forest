import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight } from "lucide-react";
import { TaskStatusSelect } from "@/components/TaskStatusSelect";
import { SubTask } from "@/types/project";

interface SubtaskRowProps {
  subtask: SubTask;
  taskId: number;
  onStatusChange: (taskId: number, subtaskId: number, newStatus: string) => void;
  onDelete: (taskId: number, subtaskId: number) => void;
  canChangeStatus: boolean;
  canDelete: boolean;
}

export const SubtaskRow = ({
  subtask,
  taskId,
  onStatusChange,
  onDelete,
  canChangeStatus,
  canDelete,
}: SubtaskRowProps) => {
  return (
    <TableRow className="group bg-muted/20 hover:bg-muted/30 transition-colors">
      <TableCell className="w-[300px]">
        <div className="flex items-center gap-2 pl-8">
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-normal truncate">
            {subtask.title}
          </span>
        </div>
      </TableCell>
      <TableCell className="w-[200px]">
        {canChangeStatus ? (
          <TaskStatusSelect
            status={subtask.status}
            onStatusChange={(newStatus) =>
              onStatusChange(taskId, subtask.id, newStatus)
            }
            className="h-8 text-sm"
          />
        ) : (
          <span className="text-muted-foreground">{subtask.status}</span>
        )}
      </TableCell>
      <TableCell className="w-[150px]" />
      <TableCell className="w-[100px] text-right">
        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(taskId, subtask.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};