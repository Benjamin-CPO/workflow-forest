import { Link } from "react-router-dom";
import { Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useImpersonation } from "@/contexts/ImpersonationContext";

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status?: 'priority' | null;
  onDelete?: (id: number) => void;
}

export const ProjectCard = ({
  id,
  title,
  description,
  dueDate,
  status,
  onDelete
}: ProjectCardProps) => {
  const { impersonatedUser } = useImpersonation();

  // Only allow admins and managers to delete projects
  const canDeleteProject = !impersonatedUser || 
    ['admin', 'manager'].includes(impersonatedUser.role.toLowerCase());

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm border relative group">
      <Link to={`/projects/${id}`} className="block">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{title}</h3>
            {status === 'priority' && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                Priority
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Due {dueDate}
          </div>
        </div>
      </Link>
      {onDelete && canDeleteProject && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(id);
          }}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )}
    </div>
  );
};