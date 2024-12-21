import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProjectCardProps {
  title: string;
  description: string;
  progress: number;
  dueDate: string;
}

export const ProjectCard = ({ title, description, progress, dueDate }: ProjectCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
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