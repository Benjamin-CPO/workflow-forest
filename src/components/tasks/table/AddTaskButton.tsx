import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddTaskButtonProps {
  onAddTask?: () => void;
}

export const AddTaskButton = ({ onAddTask }: AddTaskButtonProps) => {
  const { toast } = useToast();

  const handleAddTask = () => {
    if (!onAddTask) {
      toast({
        title: "Error",
        description: "Add task functionality is not available",
        variant: "destructive",
      });
      return;
    }
    
    onAddTask();
    toast({
      title: "Success",
      description: "New task dialog opened",
    });
  };

  return (
    <TableRow>
      <TableCell colSpan={4}>
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleAddTask}
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </TableCell>
    </TableRow>
  );
};