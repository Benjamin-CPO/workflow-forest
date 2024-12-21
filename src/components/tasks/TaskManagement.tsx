import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TaskEditDialog } from "./TaskEditDialog";
import { MilestoneTasks } from "./MilestoneTasks";
import { AddTaskDialog } from "@/components/projects/AddTaskDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const { toast } = useToast();

  const handleAddTask = (data: { title: string; dueDate: string; milestoneId: number }) => {
    const newTask = {
      id: Math.max(0, ...milestones.flatMap(m => m.tasks.map(t => t.id))) + 1,
      title: data.title,
      status: "pending",
      dueDate: data.dueDate,
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
        <div className="flex gap-2">
          <Button onClick={() => setIsDialogOpen(true)}>Add Task</Button>
          <Button variant="outline" onClick={() => setIsMilestoneDialogOpen(true)}>
            Add Milestone
          </Button>
        </div>
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
        milestones={milestones}
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

      <Dialog open={isMilestoneDialogOpen} onOpenChange={setIsMilestoneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Milestone</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter milestone title"
              value={newMilestoneTitle}
              onChange={(e) => setNewMilestoneTitle(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMilestoneDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMilestone}>Add Milestone</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
