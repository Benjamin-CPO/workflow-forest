import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { MultiColorProgress } from "@/components/ui/multi-color-progress";
import { calculateProgressColors } from "@/utils/progressUtils";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { TaskEditDialog } from "@/components/tasks/TaskEditDialog";
import { useToast } from "@/components/ui/use-toast";
import { MilestoneTasks } from "@/components/tasks/MilestoneTasks";

const projects = [
  {
    id: 1,
    title: "Website Redesign",
    description: "Complete overhaul of the company website with new branding",
    progress: 75,
    dueDate: "Mar 15, 2024",
    milestones: [
      {
        id: 1,
        title: "Design Phase",
        tasks: [
          { id: 1, title: "Design Homepage", status: "completed", dueDate: "Mar 10, 2024" },
          { id: 2, title: "Design Mobile Layout", status: "in-progress", dueDate: "Mar 12, 2024" },
        ],
      },
      {
        id: 2,
        title: "Development Phase",
        tasks: [
          { id: 3, title: "Implement Contact Form", status: "in-progress", dueDate: "Mar 12, 2024" },
          { id: 4, title: "Mobile Responsiveness", status: "pending", dueDate: "Mar 14, 2024" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "Create a new mobile app for customer engagement",
    progress: 30,
    dueDate: "Apr 1, 2024",
    tasks: [
      { id: 1, title: "UI/UX Design", status: "completed", dueDate: "Mar 20, 2024" },
      { id: 2, title: "Backend Integration", status: "pending", dueDate: "Mar 25, 2024" },
    ],
  },
  {
    id: 3,
    title: "Marketing Campaign",
    description: "Q2 marketing campaign for product launch",
    progress: 50,
    dueDate: "Mar 30, 2024",
    tasks: [
      { id: 1, title: "Content Creation", status: "in-progress", dueDate: "Mar 25, 2024" },
      { id: 2, title: "Social Media Strategy", status: "pending", dueDate: "Mar 28, 2024" },
    ],
  },
];

export const ProjectDetails = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === Number(id));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Initialize milestones from localStorage or fall back to project's default milestones
  const [milestones, setMilestones] = useState(() => {
    const savedMilestones = localStorage.getItem(`project-${id}-milestones`);
    return savedMilestones ? JSON.parse(savedMilestones) : project?.milestones || [];
  });

  // Save milestones to localStorage whenever they change
  useEffect(() => {
    if (id) {
      localStorage.setItem(`project-${id}-milestones`, JSON.stringify(milestones));
    }
  }, [milestones, id]);

  const form = useForm({
    defaultValues: {
      title: "",
      dueDate: "",
    },
  });

  if (!project) {
    return <div>Project not found</div>;
  }

  const onSubmit = (data: { title: string; dueDate: string }) => {
    const newTask = {
      id: Math.max(...milestones.flatMap(m => m.tasks.map(t => t.id))) + 1,
      title: data.title,
      status: "pending",
      dueDate: data.dueDate,
    };
    
    // Add to the first milestone by default (you might want to add milestone selection later)
    const updatedMilestones = milestones.map((milestone, index) => 
      index === 0 
        ? { ...milestone, tasks: [...milestone.tasks, newTask] }
        : milestone
    );
    
    setMilestones(updatedMilestones);
    form.reset();
    setIsDialogOpen(false);
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

  const allTasks = milestones.flatMap(milestone => milestone.tasks);
  const completedTasks = allTasks.filter(task => task.status === "completed").length;
  const progress = allTasks.length > 0 ? (completedTasks / allTasks.length) * 100 : 0;
  const progressSegments = calculateProgressColors(allTasks);

  return (
    <div className="container py-6">
      <ProjectHeader 
        title={project.title}
        description={project.description}
        dueDate={project.dueDate}
        progress={progress}
      />

      <div className="space-y-6 mt-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Progress ({completedTasks} of {allTasks.length} tasks completed)
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <MultiColorProgress segments={progressSegments} className="h-2" />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add Task</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter task title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Add Task
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <MilestoneTasks
            milestones={milestones}
            onStatusChange={handleStatusChange}
            onTaskClick={(task) => {
              setSelectedTask(task);
              setIsEditDialogOpen(true);
            }}
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
      </div>
    </div>
  );
};

export default ProjectDetails;
