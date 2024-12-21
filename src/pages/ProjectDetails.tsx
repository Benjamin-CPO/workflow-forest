import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Temporary mock data - in a real app, this would come from an API
const projects = [
  {
    id: 1,
    title: "Website Redesign",
    description: "Complete overhaul of the company website with new branding",
    progress: 75,
    dueDate: "Mar 15, 2024",
    tasks: [
      { id: 1, title: "Design Homepage", status: "completed", dueDate: "Mar 10, 2024" },
      { id: 2, title: "Implement Contact Form", status: "in-progress", dueDate: "Mar 12, 2024" },
      { id: 3, title: "Mobile Responsiveness", status: "pending", dueDate: "Mar 14, 2024" },
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
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === Number(id));
  const [tasks, setTasks] = useState(project?.tasks || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      id: tasks.length + 1,
      title: data.title,
      status: "pending",
      dueDate: data.dueDate,
    };
    
    setTasks([...tasks, newTask]);
    form.reset();
    setIsDialogOpen(false);
  };

  const handleStatusChange = (taskId: number, newStatus: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  // Calculate progress based on completed tasks
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="container py-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/projects")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Projects
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
          <p className="text-muted-foreground mb-4">{project.description}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Due {project.dueDate}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Progress ({completedTasks} of {tasks.length} tasks completed)
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due Date</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={task.status}
                      onValueChange={(value) => handleStatusChange(task.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;