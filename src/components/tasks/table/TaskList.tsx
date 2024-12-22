import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTaskPermissions } from "@/hooks/useTaskPermissions";
import { Task, SubTask } from "@/types/project";
import { TaskRow } from "./TaskRow";
import { SubtaskRow } from "./SubtaskRow";
import { NewSubtaskRow } from "./NewSubtaskRow";

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onAddSubtask?: (taskId: number, subtask: SubTask) => void;
  onDeleteSubtask?: (taskId: number, subtaskId: number) => void;
  onSubtaskStatusChange?: (taskId: number, subtaskId: number, newStatus: string) => void;
}

export const TaskList = ({
  tasks,
  onStatusChange,
  onTaskClick,
  onDeleteTask,
  onAddSubtask,
  onDeleteSubtask,
  onSubtaskStatusChange,
}: TaskListProps) => {
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [newSubtaskTitles, setNewSubtaskTitles] = useState<{ [key: number]: string }>({});
  const { toast } = useToast();
  const { hasPermission } = useTaskPermissions();

  const toggleTaskExpansion = (taskId: number) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const handleAddSubtask = (taskId: number) => {
    if (!hasPermission('add_subtask')) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to add subtasks.",
        variant: "destructive",
      });
      return;
    }

    if (!newSubtaskTitles[taskId]?.trim()) {
      toast({
        title: "Error",
        description: "Subtask title cannot be empty",
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

    const newSubtask: SubTask = {
      id: Math.random(),
      title: newSubtaskTitles[taskId],
      status: "pending"
    };

    onAddSubtask(taskId, newSubtask);
    setNewSubtaskTitles(prev => ({
      ...prev,
      [taskId]: ""
    }));

    toast({
      title: "Success",
      description: "Subtask added successfully",
    });
  };

  const handleNewSubtaskTitleChange = (taskId: number, title: string) => {
    setNewSubtaskTitles(prev => ({
      ...prev,
      [taskId]: title
    }));
  };

  const handleDeleteSubtask = (taskId: number, subtaskId: number) => {
    if (!hasPermission('delete_task')) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to delete subtasks.",
        variant: "destructive",
      });
      return;
    }

    if (!onDeleteSubtask) {
      toast({
        title: "Error",
        description: "Delete subtask functionality is not available",
        variant: "destructive",
      });
      return;
    }

    onDeleteSubtask(taskId, subtaskId);
    toast({
      title: "Success",
      description: "Subtask deleted successfully",
    });
  };

  const handleStatusChange = (taskId: number, newStatus: string) => {
    if (!hasPermission('change_status')) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to change task status.",
        variant: "destructive",
      });
      return;
    }
    onStatusChange(taskId, newStatus);
  };

  return (
    <>
      {tasks.map((task) => (
        <div key={task.id}>
          <TaskRow
            task={task}
            isExpanded={expandedTasks.has(task.id)}
            onToggleExpand={toggleTaskExpansion}
            onStatusChange={handleStatusChange}
            onTaskClick={onTaskClick}
            onDeleteTask={onDeleteTask}
          />
          {expandedTasks.has(task.id) && task.subtasks?.map((subtask) => (
            <SubtaskRow
              key={subtask.id}
              subtask={subtask}
              taskId={task.id}
              onStatusChange={onSubtaskStatusChange!}
              onDelete={handleDeleteSubtask}
            />
          ))}
          {expandedTasks.has(task.id) && hasPermission('add_subtask') && (
            <NewSubtaskRow
              taskId={task.id}
              newSubtaskTitle={newSubtaskTitles[task.id] || ""}
              onNewSubtaskTitleChange={handleNewSubtaskTitleChange}
              onAddSubtask={handleAddSubtask}
            />
          )}
        </div>
      ))}
    </>
  );
};