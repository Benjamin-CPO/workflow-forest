import { useState } from "react";
import { Task, Milestone } from "@/types/project";
import { ViewControlsContainer } from "./containers/ViewControlsContainer";
import { TaskDialogsContainer } from "./containers/TaskDialogsContainer";
import { AddMilestoneDialog } from "./AddMilestoneDialog";
import { TaskViewContent } from "./TaskViewContent";
import { useMilestoneManagement } from "@/hooks/useMilestoneManagement";
import { useTaskState } from "@/hooks/useTaskState";
import { useTaskOperations } from "@/hooks/useTaskOperations";
import { useTaskPermissions } from "@/hooks/useTaskPermissions";
import { useToast } from "@/hooks/use-toast";

interface TaskManagementProps {
  milestones: Milestone[];
  setMilestones: (milestones: Milestone[]) => void;
}

export const TaskManagement = ({ milestones, setMilestones }: TaskManagementProps) => {
  const [view, setView] = useState<"list" | "kanban">("list");
  const { hasPermission } = useTaskPermissions();
  const { toast } = useToast();
  
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    selectedTask,
    setSelectedTask,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleAddTask,
    handleDeleteTask,
    handleTaskEdit,
  } = useTaskState(milestones, setMilestones);

  const {
    handleStatusChange,
    handleSubtaskStatusChange,
    handleAddSubtask,
    handleDeleteSubtask,
  } = useTaskOperations(milestones, setMilestones);

  const {
    isMilestoneDialogOpen,
    setIsMilestoneDialogOpen,
    newMilestoneTitle,
    setNewMilestoneTitle,
    handleAddMilestone,
  } = useMilestoneManagement(milestones, setMilestones);

  const handleTaskClick = (task: Task) => {
    if (!hasPermission("edit_task")) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit tasks",
        variant: "destructive",
      });
      return;
    }
    setSelectedTask(task);
    setIsEditDialogOpen(true);
  };

  const wrappedHandleStatusChange = (taskId: number, newStatus: string) => {
    if (!hasPermission("change_status")) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to change task status",
        variant: "destructive",
      });
      return;
    }
    handleStatusChange(taskId, newStatus);
  };

  const wrappedHandleAddSubtask = (taskId: number, subtask: any) => {
    if (!hasPermission("add_subtask")) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to add subtasks",
        variant: "destructive",
      });
      return;
    }
    handleAddSubtask(taskId, subtask);
  };

  const wrappedHandleDeleteTask = (taskId: number) => {
    if (!hasPermission("delete_task")) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete tasks",
        variant: "destructive",
      });
      return;
    }
    handleDeleteTask();
  };

  return (
    <div className="h-full flex flex-col">
      <ViewControlsContainer
        onAddTask={() => {
          if (!hasPermission("create_task")) {
            toast({
              title: "Permission Denied",
              description: "You don't have permission to create tasks",
              variant: "destructive",
            });
            return;
          }
          setIsAddDialogOpen(true);
        }}
        onAddMilestone={() => setIsMilestoneDialogOpen(true)}
        view={view}
        setView={setView}
        showAddTask={hasPermission("create_task")}
      />

      <TaskViewContent
        view={view}
        milestones={milestones}
        onStatusChange={wrappedHandleStatusChange}
        onTaskClick={handleTaskClick}
        onDeleteTask={wrappedHandleDeleteTask}
        onSubtaskStatusChange={handleSubtaskStatusChange}
        onAddSubtask={wrappedHandleAddSubtask}
        onDeleteSubtask={handleDeleteSubtask}
        onAddTask={() => {
          if (!hasPermission("create_task")) {
            toast({
              title: "Permission Denied",
              description: "You don't have permission to create tasks",
              variant: "destructive",
            });
            return;
          }
          setIsAddDialogOpen(true);
        }}
      />

      <TaskDialogsContainer
        milestones={milestones}
        setMilestones={setMilestones}
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />

      <AddMilestoneDialog
        isOpen={isMilestoneDialogOpen}
        onOpenChange={setIsMilestoneDialogOpen}
        milestoneTitle={newMilestoneTitle}
        setMilestoneTitle={setNewMilestoneTitle}
        onAddMilestone={handleAddMilestone}
      />
    </div>
  );
};