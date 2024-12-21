import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { ProjectClientInfo } from "./ProjectClientInfo";
import { ProjectDeleteButton } from "./ProjectDeleteButton";

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
  const [clientName, setClientName] = useState<string>("");

  useEffect(() => {
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const client = clients.find((c: { id: number }) => c.id === clientId);
    if (client) {
      setClientName(client.name);
    }
  }, [clientId]);

  const handleDelete = () => {
    onDelete?.(id);
  };

  return (
    <Card 
      className={`hover:shadow-md transition-shadow cursor-pointer group ${
        status === 'priority' ? 'bg-orange-50' : ''
      }`}
      onClick={() => navigate(`/projects/${id}`)}
    >
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div className="space-y-2">
          <ProjectStatusBadge status={status} />
          <CardTitle className="text-lg">{title}</CardTitle>
          <ProjectClientInfo clientName={clientName} />
        </div>
        <ProjectDeleteButton projectTitle={title} onDelete={handleDelete} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Due {dueDate}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};