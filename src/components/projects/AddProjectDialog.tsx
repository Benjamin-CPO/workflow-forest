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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useImpersonation } from "@/contexts/ImpersonationContext";

interface Client {
  id: number;
  name: string;
}

export function AddProjectDialog({ children }: { children: React.ReactNode }) {
  const { impersonatedUser } = useImpersonation();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [figmaWorkfile, setFigmaWorkfile] = useState("");
  const [figmaReviewFile, setFigmaReviewFile] = useState("");
  const [status, setStatus] = useState<'priority' | null>(null);
  const [clientId, setClientId] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const navigate = useNavigate();

  // Check if user has permission to create projects
  const canCreateProject = !impersonatedUser || ["Admin", "Manager"].includes(impersonatedUser.role);

  useEffect(() => {
    const storedClients = localStorage.getItem('clients');
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    } else {
      const initialClients = [
        { id: 1, name: "Acme Corp" },
        { id: 2, name: "TechStart Inc" },
        { id: 3, name: "Global Solutions" }
      ];
      localStorage.setItem('clients', JSON.stringify(initialClients));
      setClients(initialClients);
    }
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFigmaWorkfile("");
    setFigmaReviewFile("");
    setStatus(null);
    setClientId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canCreateProject) {
      toast.error("You don't have permission to create projects");
      return;
    }

    if (!clientId) {
      toast.error("Please select a client");
      return;
    }

    const newProject = {
      id: Math.floor(Math.random() * 1000),
      title,
      description,
      progress: 0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      figmaWorkfile,
      figmaReviewFile,
      status,
      clientId: parseInt(clientId),
      milestones: []
    };

    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));

    const initialMessages = {
      'general': []
    };
    localStorage.setItem(`project-${newProject.id}-messages`, JSON.stringify(initialMessages));
    localStorage.setItem(`project-${newProject.id}-milestones`, JSON.stringify([]));

    setOpen(false);
    resetForm();
    toast.success("Project created successfully");
    navigate(`/projects/${newProject.id}`);
  };

  if (!canCreateProject) {
    return null;
  }

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
              <Label htmlFor="client">Client</Label>
              <Select
                value={clientId}
                onValueChange={setClientId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              <Label htmlFor="status">Project Priority</Label>
              <Select
                value={status || 'queue'}
                onValueChange={(value: 'priority' | 'queue') => 
                  setStatus(value === 'queue' ? null : 'priority')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="queue">In Queue</SelectItem>
                  <SelectItem value="priority">Priority Project</SelectItem>
                </SelectContent>
              </Select>
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