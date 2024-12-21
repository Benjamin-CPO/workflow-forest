import { Calendar, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiColorProgress } from "@/components/ui/multi-color-progress";
import { useNavigate } from "react-router-dom";
import { statusColors, getProjectStatus } from "@/utils/statusColors";
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
import { useState } from "react";

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  onDelete?: (id: number) => void;
}

export const ProjectCard = ({ 
  id, 
  title, 
  description, 
  progress, 
  dueDate,
  onDelete 
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const status = getProjectStatus(progress);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const segments = [
    {
      color: progress === 100 ? 'bg-green-500' : 
             progress > 0 ? 'bg-orange-500' : 
             'bg-gray-300',
      percentage: progress
    }
  ];

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
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

  return (
    <>
      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer group"
        onClick={() => navigate(`/projects/${id}`)}
      >
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
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