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
    const [type, idStr, parentIdStr] = draggableId.split('-');
    const newStatus = destination.droppableId;

    if (type === 'task' && viewMode === 'tasks') {
      const taskId = parseInt(idStr, 10);
      onStatusChange(taskId, newStatus);
      toast({
        title: "Task Updated",
        description: `Task status changed to ${newStatus}`,
      });
    } else if (type === 'subtask' && viewMode === 'subtasks' && parentIdStr) {
      const subtaskId = parseInt(idStr, 10);
      const parentTaskId = parseInt(parentIdStr, 10);
      
      onSubtaskStatusChange(parentTaskId, subtaskId, newStatus);
      toast({
        title: "Subtask Updated",
        description: `Subtask status changed to ${newStatus}`,
      });
    }
  };

  return { handleDragEnd };
};