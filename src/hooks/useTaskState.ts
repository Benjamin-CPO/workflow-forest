import { useState } from "react";
import { Task, Milestone } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

export const useTaskState = (milestones: Milestone[], setMilestones: (milestones: Milestone[]) => void) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddTask = (data: { title: string; dueDate: string; milestoneId: number }) => {
    const newTask: Task = {
      id: Math.max(0, ...milestones.flatMap(m => m.tasks.map(t => t.id))) + 1,
      title: data.title,
      status: "pending",
      dueDate: data.dueDate,
      subtasks: [],
    };

    const updatedMilestones = milestones.map(milestone =>
      milestone.id === data.milestoneId
        ? { ...milestone, tasks: [...milestone.tasks, newTask] }
        : milestone
    );

    setMilestones(updatedMilestones);
    toast({
      title: "Task added",
      description: "New task has been added successfully.",
    });
  };

  const handleDeleteTask = () => {
    if (!selectedTask) return;
    
    const updatedMilestones = milestones.map(milestone => ({
      ...milestone,
      tasks: milestone.tasks.filter(task => task.id !== selectedTask.id)
    }));
    
    setMilestones(updatedMilestones);
    setIsDeleteDialogOpen(false);
    setSelectedTask(null);
    
    toast({
      title: "Task deleted",
      description: "Task has been deleted successfully.",
    });
  };

  const handleTaskEdit = (taskId: number, data: { title: string; status: string; dueDate: string }) => {
    const updatedMilestones = milestones.map(milestone => ({
      ...milestone,
      tasks: milestone.tasks.map(task =>
        task.id === taskId ? { 
          ...task, 
          ...data,
          subtasks: task.subtasks || [] 
        } : task
      ),
    }));
    setMilestones(updatedMilestones);
    toast({
      title: "Task updated",
      description: "Task has been updated successfully.",
    });
  };

  return {
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
  };
};