import { useState } from "react";
import { Calendar, ArrowLeft, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from 'react-markdown';

interface ProjectHeaderProps {
  title: string;
  description: string;
  dueDate: string;
  progress: number;
  onUpdate?: (data: { title: string; description: string; dueDate: string }) => void;
}

export const ProjectHeader = ({ 
  title: initialTitle, 
  description: initialDescription, 
  dueDate: initialDueDate, 
  progress,
  onUpdate 
}: ProjectHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [dueDate, setDueDate] = useState(initialDueDate);

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Project title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    onUpdate?.({
      title,
      description,
      dueDate,
    });

    setIsEditing(false);
    toast({
      title: "Success",
      description: "Project details updated successfully",
    });
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setDueDate(initialDueDate);
    setIsEditing(false);
  };

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Projects
      </Button>

      <div className="bg-accent p-6 rounded-lg">
        <div className="flex justify-between items-start mb-4">
          {isEditing ? (
            <div className="flex-1 space-y-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Project title"
                className="text-2xl font-bold"
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Project description (You can use [link text](url) for links)"
                className="resize-none"
              />
              <Input
                type="date"
                value={dueDate.split(",")[0]}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full"
              />
              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-bold mb-2">{title}</h1>
                <div className="text-muted-foreground mb-4">
                  <ReactMarkdown
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          className="text-blue-500 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                    }}
                  >
                    {description}
                  </ReactMarkdown>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Due {dueDate}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};