import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { ProjectDeleteButton } from "./ProjectDeleteButton";
import { Progress } from "@/components/ui/progress";

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  status?: 'priority' | null;
  clientId: number;
  onDelete?: (id: number) => void;
}

export const ProjectCard = ({ 
  id, 
  title, 
  description, 
  progress, 
  dueDate,
  status,
  clientId,
  onDelete 
}: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    onDelete?.(id);
  };

  return (
    <Card 
      className={`hover:shadow-md transition-shadow cursor-pointer group h-[200px] ${
        status === 'priority' ? 'bg-orange-50' : ''
      }`}
      onClick={() => navigate(`/projects/${id}`)}
    >
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div className="space-y-2 flex-1">
          <ProjectStatusBadge status={status} />
          <CardTitle className="text-lg truncate" title={title}>
            {title}
          </CardTitle>
        </div>
        <ProjectDeleteButton projectTitle={title} onDelete={handleDelete} />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Due {dueDate}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};