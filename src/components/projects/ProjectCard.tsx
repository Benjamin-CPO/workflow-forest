import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { statusColors, getProjectStatus } from "@/utils/statusColors";

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
}

export const ProjectCard = ({ id, title, description, progress, dueDate }: ProjectCardProps) => {
  const navigate = useNavigate();
  const status = getProjectStatus(progress);
  const colors = statusColors[status];

  return (
    <Card 
      className={`hover:shadow-md transition-shadow cursor-pointer ${colors.bg} border-l-4 ${
        status === 'completed' ? 'border-l-green-500' :
        status === 'in-progress' ? 'border-l-orange-500' :
        'border-l-gray-500'
      }`}
      onClick={() => navigate(`/projects/${id}`)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="space-y-3">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Due {dueDate}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};