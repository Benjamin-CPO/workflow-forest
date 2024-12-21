import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { TaskEditDialog } from "@/components/tasks/TaskEditDialog";
import { MilestoneTasks } from "@/components/tasks/MilestoneTasks";
import { AddTaskDialog } from "@/components/projects/AddTaskDialog";
import { ProjectProgress } from "@/components/projects/ProjectProgress";

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

const ProjectDetails = () => {
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

  if (!project) {
    return <div>Project not found</div>;
  }

  const handleAddTask = (data: { title: string; dueDate: string }) => {
    const newTask = {
      id: Math.max(...milestones.flatMap(m => m.tasks.map(t => t.id)), 0) + 1,
      title: data.title,
      status: "pending",
      dueDate: data.dueDate,
    };
    
    // Add to the first milestone by default
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

  const allTasks = milestones.flatMap(milestone => milestone.tasks);

  return (
    <div className="container py-6">
      <ProjectHeader 
        title={project.title}
        description={project.description}
        dueDate={project.dueDate}
        progress={allTasks.length > 0 ? (allTasks.filter(t => t.status === "completed").length / allTasks.length) * 100 : 0}
      />

      <div className="space-y-6 mt-6">
        <ProjectProgress tasks={allTasks} />

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
      </div>
    </div>
  );
};

export default ProjectDetails;
