import { Calendar, Trash2, Star, Pause, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiColorProgress } from "@/components/ui/multi-color-progress";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  status?: 'priority' | 'on-hold' | null;
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
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clientName, setClientName] = useState<string>("");

  useEffect(() => {
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const client = clients.find((c: { id: number }) => c.id === clientId);
    if (client) {
      setClientName(client.name);
    }
  }, [clientId]);

  const segments = [
    {
      color: progress === 100 ? 'bg-green-500' : 
             progress > 0 ? 'bg-orange-500' : 
             'bg-gray-300',
      percentage: progress
    }
  ];

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(id);
      toast({
        title: "Project deleted",
        description: `${title} has been deleted successfully.`
      });
    }
    setShowDeleteDialog(false);
  };

  const handleCancelDelete = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShowDeleteDialog(false);
  };

  const getStatusBadge = () => {
    if (status === 'priority') {
      return (
        <Badge className="bg-[#F97316] hover:bg-[#F97316]/80 gap-1">
          <Star className="h-3 w-3" />
          Priority Project
        </Badge>
      );
    }
    if (status === 'on-hold') {
      return (
        <Badge variant="secondary" className="bg-[#8E9196] hover:bg-[#8E9196]/80 text-white gap-1">
          <Pause className="h-3 w-3" />
          Project on Hold
        </Badge>
      );
    }
    return null;
  };

  return (
    <>
      <Card 
        className={`hover:shadow-md transition-shadow cursor-pointer group ${
          status === 'priority' ? 'bg-orange-50' : 
          status === 'on-hold' ? 'bg-gray-50' : ''
        }`}
        onClick={() => navigate(`/projects/${id}`)}
      >
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{title}</CardTitle>
            <div className="flex flex-col gap-2">
              {getStatusBadge()}
              <div className="flex items-center text-sm text-muted-foreground gap-1">
                <Building2 className="h-4 w-4" />
                {clientName}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity -mt-2 -mr-2"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={e => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              "{title}" and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};