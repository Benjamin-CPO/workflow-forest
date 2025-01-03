import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, GripVertical } from "lucide-react";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { ProjectDeleteButton } from "./ProjectDeleteButton";
import { ProjectProgressBar } from "./ProjectProgressBar";
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
  dueDate: string;
  status?: 'priority' | null;
  clientId: number;
  onDelete?: (id: number) => void;
}

export const ProjectCard = ({ 
  id, 
  title, 
  description, 
  dueDate,
  status,
  onDelete,
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const storedMilestones = JSON.parse(localStorage.getItem(`project-${id}-milestones`) || '[]');

  return (
    <Card 
      className={`hover:shadow-md transition-shadow cursor-pointer group h-[200px] ${
        status === 'priority' ? 'bg-orange-50' : ''
      }`}
      onClick={() => navigate(`/projects/${id}`)}
    >
      <CardHeader className="pb-1.5 px-2.5 pt-2.5 flex flex-row items-start justify-between">
        <div className="space-y-0.5 flex-1">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <ProjectStatusBadge status={status} />
          </div>
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
        <ProjectDeleteButton projectTitle={title} onDelete={() => onDelete?.(id)} />
      </CardHeader>
      <CardContent className="px-2.5 pb-2.5 space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            Due {dueDate}
          </div>
        </div>
        <ProjectProgressBar milestones={storedMilestones} />
      </CardContent>
    </Card>
  );
};