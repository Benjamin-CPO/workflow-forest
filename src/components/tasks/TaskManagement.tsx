import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TaskEditDialog } from "./TaskEditDialog";
import { MilestoneTasks } from "./MilestoneTasks";
import { AddTaskDialog } from "@/components/projects/AddTaskDialog";
import { Button } from "@/components/ui/button";

interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
}

interface Milestone {
  id: number;
  title: string;
  tasks: Task[];
}

interface TaskManagementProps {
  milestones: Milestone[];
  setMilestones: (milestones: Milestone[]) => void;
}

export const TaskManagement = ({ milestones, setMilestones }: TaskManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddTask = (data: { title: string; dueDate: string }) => {
    if (milestones.length === 0) {
      const newMilestone = {
        id: 1,
        title: "General Tasks",
        tasks: [],
      };
      setMilestones([newMilestone]);
    }

    const newTask = {
      id: Math.max(...milestones.flatMap(m => m.tasks.map(t => t.id)), 0) + 1,
      title: data.title,
      status: "pending",
      dueDate: data.dueDate,
    };
    
    const updatedMilestones = milestones.map((milestone, index) => 
      index === 0 
        ? { ...milestone, tasks: [...milestone.tasks, newTask] }
        : milestone
    );
    
    setMilestones(updatedMilestones);
    toast({
      title: "Task added",
      description: "New task has been added successfully.",
    });
  };

  const handleStatusChange = (taskId: number, newStatus: string) => {
    const updatedMilestones = milestones.map(milestone => ({
      ...milestone,
      tasks: milestone.tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ),
    }));
    setMilestones(updatedMilestones);
  };

  const handleTaskEdit = (taskId: number, data: { title: string; status: string; dueDate: string }) => {
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button onClick={() => setIsDialogOpen(true)}>Add Task</Button>
      </div>

      <MilestoneTasks
        milestones={milestones}
        onStatusChange={handleStatusChange}
        onTaskClick={(task) => {
          setSelectedTask(task);
          setIsEditDialogOpen(true);
        }}
      />

      <AddTaskDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddTask}
      />

      <TaskEditDialog
        task={selectedTask}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleTaskEdit}
      />
    </div>
  );
};