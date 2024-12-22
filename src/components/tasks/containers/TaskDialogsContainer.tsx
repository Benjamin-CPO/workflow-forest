import { Task, Milestone } from "@/types/project";
import { TaskDialogs } from "../TaskDialogs";
import { useToast } from "@/hooks/use-toast";
import { useTaskPermissions } from "@/hooks/useTaskPermissions";

interface TaskDialogsContainerProps {
  milestones: Milestone[];
  setMilestones: (milestones: Milestone[]) => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
}

export const TaskDialogsContainer = ({
  milestones,
  setMilestones,
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedTask,
  setSelectedTask,
}: TaskDialogsContainerProps) => {
  const { toast } = useToast();
  const { hasPermission } = useTaskPermissions();

  const handleAddTask = (data: { title: string; dueDate: string; milestoneId: number }) => {
    if (!hasPermission('create_task')) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to create tasks.",
        variant: "destructive",
      });
      return;
    }

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

  const handleEditTask = (taskId: number, data: { title: string; status: string; dueDate: string }) => {
    if (!hasPermission('edit_task')) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to edit tasks.",
        variant: "destructive",
      });
      return;
    }

    const updatedMilestones = milestones.map(milestone => ({
      ...milestone,
      tasks: milestone.tasks.map(task =>
        task.id === taskId ? { ...task, ...data } : task
      ),
    }));
    setMilestones(updatedMilestones);
    toast({
      title: "Task updated",
      description: "Task has been updated successfully.",
    });
  };

  const handleDeleteTask = () => {
    if (!hasPermission('delete_task')) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to delete tasks.",
        variant: "destructive",
      });
      return;
    }

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

  return (
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
      onEditTask={handleEditTask}
      onDeleteTask={handleDeleteTask}
    />
  );
};