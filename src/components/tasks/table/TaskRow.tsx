import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronRight } from "lucide-react";
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
    <TableRow className="cursor-pointer hover:bg-muted/50">
      <TableCell className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0"
          onClick={() => onToggleExpand(task.id)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        <span onClick={() => onTaskClick(task)}>{task.title}</span>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <TaskStatusSelect
          status={task.status}
          onStatusChange={(value) => onStatusChange(task.id, value)}
        />
      </TableCell>
      <TableCell>{task.dueDate}</TableCell>
      <TableCell>
        {onDeleteTask && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTask(task.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};