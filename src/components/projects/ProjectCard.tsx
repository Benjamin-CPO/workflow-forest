import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { ProjectDeleteButton } from "./ProjectDeleteButton";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      className={`hover:shadow-md transition-shadow cursor-pointer group h-[180px] ${
        status === 'priority' ? 'bg-orange-50' : ''
      }`}
      onClick={() => navigate(`/projects/${id}`)}
    >
      <CardHeader className="pb-2 px-3 pt-3 flex flex-row items-start justify-between">
        <div className="space-y-1 flex-1">
          <ProjectStatusBadge status={status} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CardTitle className="text-base truncate" title={title}>
                  {title}
                </CardTitle>
              </TooltipTrigger>
              <TooltipContent>
                <p>{title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ProjectDeleteButton projectTitle={title} onDelete={handleDelete} />
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            Due {dueDate}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};