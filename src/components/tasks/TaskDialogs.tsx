import { AddTaskDialog } from "@/components/projects/AddTaskDialog";
import { TaskEditDialog } from "./TaskEditDialog";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { Task, Milestone } from "@/types/project";

interface TaskDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  milestones: Milestone[];
  onAddTask: (data: { title: string; dueDate: string; milestoneId: number }) => void;
  onEditTask: (taskId: number, data: { title: string; status: string; dueDate: string }) => void;
  onDeleteTask: () => void;
}

export const TaskDialogs = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedTask,
  setSelectedTask,
  milestones,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: TaskDialogsProps) => {
  return (
    <>
      <AddTaskDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={onAddTask}
        milestones={milestones}
      />

      <TaskEditDialog
        task={selectedTask}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedTask(null);
        }}
        onSave={onEditTask}
      />

      <DeleteTaskDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onDeleteTask}
        taskTitle={selectedTask?.title || ""}
      />
    </>
  );
};