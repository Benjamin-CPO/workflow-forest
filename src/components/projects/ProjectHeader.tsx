import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ProjectDisplay } from "./ProjectDisplay";
import { ProjectEditForm } from "./ProjectEditForm";

interface ProjectHeaderProps {
  title: string;
  description: string;
  dueDate: string;
  progress: number;
  figmaWorkfile?: string;
  figmaReviewFile?: string;
  onUpdate?: (data: {
    title: string;
    description: string;
    dueDate: string;
    figmaWorkfile?: string;
    figmaReviewFile?: string;
  }) => void;
}

export const ProjectHeader = ({
  title: initialTitle,
  description: initialDescription,
  dueDate: initialDueDate,
  figmaWorkfile: initialFigmaWorkfile = '',
  figmaReviewFile: initialFigmaReviewFile = '',
  progress,
  onUpdate
}: ProjectHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [dueDate, setDueDate] = useState(initialDueDate);
  const [figmaWorkfile, setFigmaWorkfile] = useState(initialFigmaWorkfile);
  const [figmaReviewFile, setFigmaReviewFile] = useState(initialFigmaReviewFile);

  const handleSave = (data: {
    title: string;
    description: string;
    dueDate: string;
    figmaWorkfile?: string;
    figmaReviewFile?: string;
  }) => {
    if (!data.title.trim()) {
      toast({
        title: "Error",
        description: "Project title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setTitle(data.title);
    setDescription(data.description);
    setDueDate(data.dueDate);
    setFigmaWorkfile(data.figmaWorkfile || '');
    setFigmaReviewFile(data.figmaReviewFile || '');
    
    onUpdate?.(data);
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
    setFigmaWorkfile(initialFigmaWorkfile);
    setFigmaReviewFile(initialFigmaReviewFile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
      </div>

      <div className="bg-background rounded-lg">
        <div className="flex justify-between items-start">
          {isEditing ? (
            <ProjectEditForm
              title={title}
              description={description}
              dueDate={dueDate}
              figmaWorkfile={figmaWorkfile}
              figmaReviewFile={figmaReviewFile}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <ProjectDisplay
              title={title}
              description={description}
              dueDate={dueDate}
              figmaWorkfile={figmaWorkfile}
              figmaReviewFile={figmaReviewFile}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};