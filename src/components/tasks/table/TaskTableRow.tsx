import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { TaskStatusSelect } from "@/components/TaskStatusSelect";
import { Task, SubTask } from "@/types/project";
import { SubtaskRow } from "./SubtaskRow";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import { useImpersonation } from "@/contexts/ImpersonationContext";

interface TaskTableRowProps {
  task: Task;
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onAddSubtask?: (taskId: number, subtask: SubTask) => void;
  onDeleteSubtask?: (taskId: number, subtaskId: number) => void;
  onSubtaskStatusChange?: (taskId: number, subtaskId: number, newStatus: string) => void;
}

export const TaskTableRow = ({
  task,
  onStatusChange,
  onTaskClick,
  onDeleteTask,
  onAddSubtask,
  onDeleteSubtask,
  onSubtaskStatusChange,
}: TaskTableRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const { toast } = useToast();
  const { impersonatedUser } = useImpersonation();

  const canChangeStatus = !impersonatedUser || ["Admin", "Manager", "Designer", "Client"].includes(impersonatedUser.role);
  const canDeleteTask = !impersonatedUser || ["Admin", "Manager"].includes(impersonatedUser.role);
  const canAddSubtask = !impersonatedUser || ["Admin", "Manager", "Designer"].includes(impersonatedUser.role);

  const handleAddSubtask = () => {
    if (!canAddSubtask) {
      toast({
        title: "Error",
        description: "You don't have permission to add subtasks",
        variant: "destructive",
      });
      return;
    }

    if (!onAddSubtask) {
      toast({
        title: "Error",
        description: "Add subtask functionality is not available",
        variant: "destructive",
      });
      return;
    }

    if (!newSubtaskTitle.trim()) {
      toast({
        title: "Error",
        description: "Subtask title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newSubtask: SubTask = {
      id: Math.random(),
      title: newSubtaskTitle,
      status: "pending"
    };

    onAddSubtask(task.id, newSubtask);
    setNewSubtaskTitle("");
    
    toast({
      title: "Success",
      description: "Subtask added successfully",
    });
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddSubtask();
    }
  };

  return (
    <>
      <TableRow className="group">
        <TableCell className="w-[300px]">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4"
              onClick={handleToggleExpand}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
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
          {canChangeStatus ? (
            <TaskStatusSelect
              status={task.status}
              onStatusChange={(newStatus) => onStatusChange(task.id, newStatus)}
            />
          ) : (
            <span className="text-muted-foreground">{task.status}</span>
          )}
        </TableCell>
        <TableCell className="w-[150px]">{task.dueDate}</TableCell>
        <TableCell className="w-[100px] text-right">
          {canDeleteTask && onDeleteTask && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </TableCell>
      </TableRow>
      {isExpanded && (
        <>
          {task.subtasks?.map((subtask) => (
            <SubtaskRow
              key={subtask.id}
              subtask={subtask}
              taskId={task.id}
              onStatusChange={onSubtaskStatusChange!}
              onDelete={onDeleteSubtask!}
              canChangeStatus={canChangeStatus}
              canDelete={canDeleteTask}
            />
          ))}
          {canAddSubtask && (
            <TableRow className="bg-muted/30">
              <TableCell className="w-[300px]">
                <div className="flex items-center gap-2 pl-8">
                  <Input
                    placeholder="Add a new subtask"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="h-8"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleAddSubtask}
                    type="button"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </TableCell>
              <TableCell className="w-[200px]" />
              <TableCell className="w-[150px]" />
              <TableCell className="w-[100px]" />
            </TableRow>
          )}
        </>
      )}
    </>
  );
};
