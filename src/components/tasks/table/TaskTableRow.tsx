import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { TaskStatusSelect } from "@/components/TaskStatusSelect";
import { Task, SubTask } from "@/types/project";
import { SubtaskRow } from "./SubtaskRow";
import { NewSubtaskRow } from "./NewSubtaskRow";

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

  const handleAddSubtask = () => {
    if (!onAddSubtask || !newSubtaskTitle.trim()) return;

    const newSubtask: SubTask = {
      id: Math.random(),
      title: newSubtaskTitle,
      status: "pending"
    };

    onAddSubtask(task.id, newSubtask);
    setNewSubtaskTitle("");
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
              onClick={() => setIsExpanded(!isExpanded)}
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
        </TableCell>
      </TableRow>
      {isExpanded && task.subtasks?.map((subtask) => (
        <SubtaskRow
          key={subtask.id}
          subtask={subtask}
          taskId={task.id}
          onStatusChange={onSubtaskStatusChange!}
          onDelete={onDeleteSubtask!}
        />
      ))}
      {isExpanded && onAddSubtask && (
        <NewSubtaskRow
          taskId={task.id}
          newSubtaskTitle={newSubtaskTitle}
          onNewSubtaskTitleChange={(_, title) => setNewSubtaskTitle(title)}
          onAddSubtask={handleAddSubtask}
        />
      )}
    </>
  );
};