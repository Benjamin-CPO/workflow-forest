import { Milestone, Task, SubTask } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

export const useTaskOperations = (milestones: Milestone[], setMilestones: (milestones: Milestone[]) => void) => {
  const { toast } = useToast();

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
    toast({
      title: "Success",
      description: "Subtask added successfully",
    });
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
    toast({
      title: "Success",
      description: "Subtask deleted successfully",
    });
  };

  return {
    handleStatusChange,
    handleSubtaskStatusChange,
    handleAddSubtask,
    handleDeleteSubtask,
  };
};