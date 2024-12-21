import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function AddProjectDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [figmaWorkfile, setFigmaWorkfile] = useState("");
  const [figmaReviewFile, setFigmaReviewFile] = useState("");
  const navigate = useNavigate();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFigmaWorkfile("");
    setFigmaReviewFile("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would be an API call
    const newProject = {
      id: Math.floor(Math.random() * 1000), // Temporary ID generation
      title,
      description,
      progress: 0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      figmaWorkfile,
      figmaReviewFile,
      milestones: [] // Initialize with no milestones
    };

    // Add the new project to the projects array
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));

    // Initialize empty chat messages for the new project
    const initialMessages = {};
    localStorage.setItem(`project-${newProject.id}-messages`, JSON.stringify(initialMessages));

    // Initialize empty milestones for the new project
    localStorage.setItem(`project-${newProject.id}-milestones`, JSON.stringify([]));

    setOpen(false);
    resetForm();
    toast.success("Project created successfully");
    navigate(`/projects/${newProject.id}`);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to your workspace. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="figmaWorkfile">Figma Work File URL</Label>
              <Input
                id="figmaWorkfile"
                type="url"
                value={figmaWorkfile}
                onChange={(e) => setFigmaWorkfile(e.target.value)}
                placeholder="Enter Figma work file URL"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="figmaReviewFile">Figma Review File URL</Label>
              <Input
                id="figmaReviewFile"
                type="url"
                value={figmaReviewFile}
                onChange={(e) => setFigmaReviewFile(e.target.value)}
                placeholder="Enter Figma review file URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}