import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiColorProgress } from "@/components/ui/multi-color-progress";
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

  // Calculate progress segments based on completion percentage
  const segments = [
    {
      color: progress === 100 ? 'bg-green-500' : 
             progress > 0 ? 'bg-orange-500' : 
             'bg-gray-300',
      percentage: progress
    }
  ];

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/projects/${id}`)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="space-y-3">
          <MultiColorProgress segments={segments} />
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Due {dueDate}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};