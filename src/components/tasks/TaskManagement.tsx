import { useState } from "react";
import { Task, Milestone } from "@/types/project";
import { ViewControlsContainer } from "./containers/ViewControlsContainer";
import { TaskDialogsContainer } from "./containers/TaskDialogsContainer";
import { AddMilestoneDialog } from "./AddMilestoneDialog";
import { TaskViewContent } from "./TaskViewContent";
import { useMilestoneManagement } from "@/hooks/useMilestoneManagement";
import { useTaskState } from "@/hooks/useTaskState";
import { useTaskOperations } from "@/hooks/useTaskOperations";

interface TaskManagementProps {
  milestones: Milestone[];
  setMilestones: (milestones: Milestone[]) => void;
}

export const TaskManagement = ({ milestones, setMilestones }: TaskManagementProps) => {
  const [view, setView] = useState<"list" | "kanban">("list");
  
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
    isMilestoneDialogOpen,
    setIsMilestoneDialogOpen,
    newMilestoneTitle,
    setNewMilestoneTitle,
    handleAddMilestone,
  } = useMilestoneManagement(milestones, setMilestones);

  const {
    handleStatusChange,
    handleSubtaskStatusChange,
    handleAddSubtask,
    handleDeleteSubtask,
  } = useTaskOperations(milestones, setMilestones);

  return (
    <div className="h-full flex flex-col">
      <ViewControlsContainer
        onAddTask={() => setIsAddDialogOpen(true)}
        onAddMilestone={() => setIsMilestoneDialogOpen(true)}
        view={view}
        setView={setView}
      />

      <TaskViewContent
        view={view}
        milestones={milestones}
        onStatusChange={handleStatusChange}
        onTaskClick={(task: Task) => {
          setSelectedTask(task);
          setIsEditDialogOpen(true);
        }}
        onDeleteTask={(taskId: number) => {
          const taskToDelete = milestones
            .flatMap(m => m.tasks)
            .find(t => t.id === taskId);
          if (taskToDelete) {
            setSelectedTask(taskToDelete);
            setIsDeleteDialogOpen(true);
          }
        }}
        onSubtaskStatusChange={handleSubtaskStatusChange}
        onAddSubtask={handleAddSubtask}
        onDeleteSubtask={handleDeleteSubtask}
        onAddTask={() => setIsAddDialogOpen(true)}
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