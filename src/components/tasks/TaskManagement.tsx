import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MilestoneTasks } from "./MilestoneTasks";
import { KanbanView } from "./KanbanView";
import { TaskDialogs } from "./TaskDialogs";
import { ViewControls } from "./ViewControls";
import { AddMilestoneDialog } from "./AddMilestoneDialog";
import { useTaskState } from "@/hooks/useTaskState";
import { Task, Milestone, SubTask } from "@/types/project";

interface TaskManagementProps {
  milestones: Milestone[];
  setMilestones: (milestones: Milestone[]) => void;
}

export const TaskManagement = ({ milestones, setMilestones }: TaskManagementProps) => {
  const [view, setView] = useState<"list" | "kanban">("list");
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
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

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a milestone title.",
        variant: "destructive",
      });
      return;
    }

    const newMilestone: Milestone = {
      id: Math.max(0, ...milestones.map(m => m.id)) + 1,
      title: newMilestoneTitle,
      tasks: [],
    };

    setMilestones([...milestones, newMilestone]);
    setNewMilestoneTitle("");
    setIsMilestoneDialogOpen(false);
    toast({
      title: "Milestone added",
      description: "New milestone has been added successfully.",
    });
  };

  const handleStatusChange = (taskId: number, newStatus: string) => {
    const updatedMilestones = milestones.map(milestone => ({
      ...milestone,
      tasks: milestone.tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus, subtasks: task.subtasks || [] } : task
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
    toast({
      title: "Status Updated",
      description: "Subtask status has been updated successfully.",
    });
  };

  const handleAddSubtask = (taskId: number, subtask: SubTask) => {
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
      <ViewControls
        view={view}
        setView={setView}
        onAddTask={() => setIsAddDialogOpen(true)}
        onAddMilestone={() => setIsMilestoneDialogOpen(true)}
      />

      <div className="flex-1 overflow-auto">
        {view === "list" ? (
          <MilestoneTasks
            milestones={milestones}
            onStatusChange={handleStatusChange}
            onTaskClick={(task: Task) => {
              setSelectedTask({ ...task, subtasks: task.subtasks || [] });
              setIsEditDialogOpen(true);
            }}
            onDeleteTask={(taskId) => {
              const taskToDelete = milestones
                .flatMap(m => m.tasks)
                .find(t => t.id === taskId);
              if (taskToDelete) {
                setSelectedTask({ ...taskToDelete, subtasks: taskToDelete.subtasks || [] });
                setIsDeleteDialogOpen(true);
              }
            }}
            onSubtaskStatusChange={handleSubtaskStatusChange}
            onAddTask={() => setIsAddDialogOpen(true)}
            onAddSubtask={handleAddSubtask}
            onDeleteSubtask={handleDeleteSubtask}
          />
        ) : (
          <KanbanView
            milestones={milestones}
            onStatusChange={handleStatusChange}
            onTaskClick={(task: Task) => {
              setSelectedTask({ ...task, subtasks: task.subtasks || [] });
              setIsEditDialogOpen(true);
            }}
            onSubtaskStatusChange={handleSubtaskStatusChange}
          />
        )}
      </div>

      <TaskDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        milestones={milestones}
        onAddTask={handleAddTask}
        onEditTask={handleTaskEdit}
        onDeleteTask={handleDeleteTask}
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
