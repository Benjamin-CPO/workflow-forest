import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { TaskStatusSelect } from "@/components/TaskStatusSelect";
import { Task } from "@/types/project";

interface TaskRowProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: (taskId: number) => void;
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
}

export const TaskRow = ({
  task,
  isExpanded,
  onToggleExpand,
  onStatusChange,
  onTaskClick,
  onDeleteTask,
}: TaskRowProps) => {
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  const handleTaskClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTaskClick(task);
  };

  return (
    <TableRow className="group">
      <TableCell className="w-[300px]">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(task.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <span
            className="cursor-pointer hover:underline truncate"
            onClick={handleTaskClick}
          >
            {task.title}
          </span>
          {isExpanded && !hasSubtasks && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleTaskClick}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Subtask
            </Button>
          )}
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
        {onDeleteTask && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTask(task.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};