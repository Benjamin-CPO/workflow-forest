import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddTaskButtonProps {
  onAddTask?: () => void;
}

export const AddTaskButton = ({ onAddTask }: AddTaskButtonProps) => {
  return (
    <TableRow>
      <TableCell colSpan={4}>
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
          onClick={onAddTask}
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </TableCell>
    </TableRow>
  );
};