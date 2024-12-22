import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TaskEditDialog } from "./TaskEditDialog";
import { MilestoneTasks } from "./MilestoneTasks";
import { KanbanView } from "./KanbanView";
import { AddTaskDialog } from "@/components/projects/AddTaskDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Kanban } from "lucide-react";
import { Task, Milestone } from "@/types/project";

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
  const [view, setView] = useState<"list" | "kanban">("list");
  const { toast } = useToast();

  const handleAddTask = (data: { title: string; dueDate: string; milestoneId: number }) => {
    const newTask: Task = {
      id: Math.max(0, ...milestones.flatMap(m => m.tasks.map(t => t.id))) + 1,
      title: data.title,
      status: "pending",
      dueDate: data.dueDate,
      subtasks: [], // Initialize empty subtasks array
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

  const handleDeleteTask = (taskId: number) => {
    const updatedMilestones = milestones.map(milestone => ({
      ...milestone,
      tasks: milestone.tasks.filter(task => task.id !== taskId)
    }));
    setMilestones(updatedMilestones);
  };

  const handleAddSubtask = (taskId: number, subtask: { title: string; status: string }) => {
    const updatedMilestones = milestones.map(milestone => ({
      ...milestone,
      tasks: milestone.tasks.map(task => {
        if (task.id === taskId) {
          const newSubtask = {
            id: Math.max(0, ...(task.subtasks?.map(st => st.id) || []), 0) + 1,
            ...subtask
          };
          return {
            ...task,
            subtasks: [...(task.subtasks || []), newSubtask]
          };
        }
        return task;
      })
    }));
    setMilestones(updatedMilestones);
  };

  const handleDeleteSubtask = (taskId: number, subtaskId: number) => {
    const updatedMilestones = milestones.map(milestone => ({
      ...milestone,
      tasks: milestone.tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.filter(st => st.id !== subtaskId)
          };
        }
        return task;
      })
    }));
    setMilestones(updatedMilestones);
  };

  const handleSubtaskStatusChange = (taskId: number, subtaskId: number, newStatus: string) => {
    const updatedMilestones = milestones.map(milestone => ({
      ...milestone,
      tasks: milestone.tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtaskId ? { ...st, status: newStatus } : st
            )
          };
        }
        return task;
      })
    }));
    setMilestones(updatedMilestones);
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
    <div className="h-full flex flex-col">
      <div className="sticky top-0 bg-background z-10 p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value as "list" | "kanban")}>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="kanban" aria-label="Kanban view">
                <Kanban className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsDialogOpen(true)}>Add Task</Button>
            <Button variant="outline" onClick={() => setIsMilestoneDialogOpen(true)}>
              Add Milestone
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {view === "list" ? (
          <MilestoneTasks
            milestones={milestones}
            onStatusChange={handleStatusChange}
            onTaskClick={(task) => {
              setSelectedTask(task);
              setIsEditDialogOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
            onAddSubtask={handleAddSubtask}
            onDeleteSubtask={handleDeleteSubtask}
            onSubtaskStatusChange={handleSubtaskStatusChange}
          />
        ) : (
          <KanbanView
            milestones={milestones}
            onStatusChange={handleStatusChange}
            onTaskClick={(task) => {
              setSelectedTask(task);
              setIsEditDialogOpen(true);
            }}
          />
        )}
      </div>

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
