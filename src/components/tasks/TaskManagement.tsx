import { useState } from "react";
import { Task, Milestone } from "@/types/project";
import { ViewControlsContainer } from "./containers/ViewControlsContainer";
import { TaskDialogsContainer } from "./containers/TaskDialogsContainer";
import { AddMilestoneDialog } from "./AddMilestoneDialog";
import { MilestoneTasks } from "./MilestoneTasks";
import { KanbanView } from "./KanbanView";
import { useMilestoneManagement } from "@/hooks/useMilestoneManagement";
import { useTaskState } from "@/hooks/useTaskState";

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

  const handleStatusChange = (taskId: number, newStatus: string) => {
    const updatedMilestones = milestones.map(milestone => ({
      ...milestone,
      tasks: milestone.tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ),
    }));
    setMilestones(updatedMilestones);
  };

  const handleSubtaskStatusChange = (taskId: number, subtaskId: number, newStatus: string) => {
    const updatedMilestones = milestones.map(milestone => ({
      ...milestone,
      tasks: milestone.tasks.map(task => {
        if (task.id === taskId && task.subtasks) {
          return {
            ...task,
            subtasks: task.subtasks.map(subtask =>
              subtask.id === subtaskId ? { ...subtask, status: newStatus } : subtask
            ),
          };
        }
        return task;
      }),
    }));
    setMilestones(updatedMilestones);
  };

  const handleAddSubtask = (taskId: number, subtask: { id: number; title: string; status: string }) => {
    const updatedMilestones = milestones.map(milestone => ({
      ...milestone,
      tasks: milestone.tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: [...(task.subtasks || []), subtask],
          };
        }
        return task;
      }),
    }));
    setMilestones(updatedMilestones);
  };

  const handleDeleteSubtask = (taskId: number, subtaskId: number) => {
    const updatedMilestones = milestones.map(milestone => ({
      ...milestone,
      tasks: milestone.tasks.map(task => {
        if (task.id === taskId && task.subtasks) {
          return {
            ...task,
            subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId),
          };
        }
        return task;
      }),
    }));
    setMilestones(updatedMilestones);
  };

  return (
    <div className="h-full flex flex-col">
      <ViewControlsContainer
        onAddTask={() => setIsAddDialogOpen(true)}
        onAddMilestone={() => setIsMilestoneDialogOpen(true)}
      />

      <div className="flex-1 overflow-auto">
        {view === "list" ? (
          <MilestoneTasks
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
        ) : (
          <KanbanView
            milestones={milestones}
            onStatusChange={handleStatusChange}
            onTaskClick={(task: Task) => {
              setSelectedTask(task);
              setIsEditDialogOpen(true);
            }}
            onSubtaskStatusChange={handleSubtaskStatusChange}
          />
        )}
      </div>

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