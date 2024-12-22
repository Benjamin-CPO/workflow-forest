import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskStatusSelect } from "@/components/TaskStatusSelect";
import { TaskRowProps } from "../types/table";

export const TaskRow = ({
  task,
  isExpanded,
  onToggleExpand,
  onStatusChange,
  onTaskClick,
  onDeleteTask,
}: TaskRowProps) => {
  return (
    <TableRow className="group">
      <TableCell className="w-[300px]">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4"
            onClick={() => onToggleExpand(task.id)}
          >
            {task.subtasks && task.subtasks.length > 0 ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <div className="w-4" />
            )}
          </Button>
          <span
            className="cursor-pointer hover:underline truncate"
            onClick={() => onTaskClick(task)}
          >
            {task.title}
          </span>
        </div>
      </TableCell>
      <TableCell className="w-[200px]">
        <TaskStatusSelect
          status={task.status}
          onStatusChange={(newStatus) => onStatusChange(task.id, newStatus)}
        />
      </TableCell>
      <TableCell className="w-[150px]">{task.dueDate}</TableCell>
      <TableCell className="w-[100px] text-right">
        <div className="flex justify-end">
          {onDeleteTask && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};