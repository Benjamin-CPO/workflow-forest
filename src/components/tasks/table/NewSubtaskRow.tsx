import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { NewSubtaskRowProps } from "../types/table";

export const NewSubtaskRow = ({
  taskId,
  newSubtaskTitle,
  onNewSubtaskTitleChange,
  onAddSubtask,
}: NewSubtaskRowProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddSubtask(taskId);
    }
  };

  return (
    <TableRow className="bg-muted/30">
      <TableCell className="pl-10">
        <div className="flex items-center gap-2">
          <Input
            placeholder="New subtask title"
            value={newSubtaskTitle}
            onChange={(e) => onNewSubtaskTitleChange(taskId, e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-8"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAddSubtask(taskId)}
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};