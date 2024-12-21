import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProjectHeaderProps {
  title: string;
  description: string;
  dueDate: string;
  progress: number;
}

export const ProjectHeader = ({ title, description, dueDate, progress }: ProjectHeaderProps) => {
  const navigate = useNavigate();

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
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          Due {dueDate}
        </div>
      </div>
    </div>
  );
};