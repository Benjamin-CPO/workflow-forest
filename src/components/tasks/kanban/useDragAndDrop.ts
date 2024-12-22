import { useToast } from "@/hooks/use-toast";
import { DragEndResult } from "./types";

export const useDragAndDrop = (
  onStatusChange: (taskId: number, newStatus: string) => void,
  onSubtaskStatusChange: (taskId: number, subtaskId: number, newStatus: string) => void,
  viewMode: 'tasks' | 'subtasks'
) => {
  const { toast } = useToast();

  const handleDragEnd = (result: DragEndResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const [type, idStr] = draggableId.split('-');
    const newStatus = destination.droppableId;
    const numericId = parseInt(idStr, 10);

    if (type === 'task' && viewMode === 'tasks') {
      onStatusChange(numericId, newStatus);
      toast({
        title: "Task Updated",
        description: `Task status changed to ${newStatus}`,
      });
    } else if (type === 'subtask' && viewMode === 'subtasks') {
      // Extract parentTaskId from the draggableId
      // Format is 'subtask-subtaskId-parentTaskId'
      const parts = draggableId.split('-');
      const parentTaskId = parseInt(parts[2], 10);
      const subtaskId = parseInt(parts[1], 10);
      
      onSubtaskStatusChange(parentTaskId, subtaskId, newStatus);
      toast({
        title: "Subtask Updated",
        description: `Subtask status changed to ${newStatus}`,
      });
    }
  };

  return { handleDragEnd };
};