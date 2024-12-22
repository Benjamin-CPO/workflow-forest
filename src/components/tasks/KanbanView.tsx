import { DragDropContext } from "@hello-pangea/dnd";
import { useState } from "react";
import { Milestone } from "@/types/project";
import { KanbanColumn } from "./kanban/KanbanColumn";
import { MilestoneFilter } from "./kanban/MilestoneFilter";
import { KanbanItem, TaskWithMilestone, SubTaskWithParent } from "./types/kanban";
import { useToast } from "@/hooks/use-toast";

interface KanbanViewProps {
  milestones: Milestone[];
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: any) => void;
  onSubtaskStatusChange: (taskId: number, subtaskId: number, newStatus: string) => void;
}

const columns = [
  { status: "pending", label: "Pending", bgColor: "bg-gray-100", textColor: "text-gray-700" },
  { status: "in-progress", label: "In Progress", bgColor: "bg-blue-100", textColor: "text-blue-700" },
  { status: "need-revision", label: "Need Revision", bgColor: "bg-red-100", textColor: "text-red-700" },
  { status: "pending-feedback", label: "Pending Feedback", bgColor: "bg-yellow-100", textColor: "text-yellow-700" },
  { status: "completed", label: "Completed", bgColor: "bg-green-100", textColor: "text-green-700" }
];

export const KanbanView = ({ 
  milestones, 
  onStatusChange, 
  onTaskClick,
  onSubtaskStatusChange 
}: KanbanViewProps) => {
  const [selectedMilestoneIds, setSelectedMilestoneIds] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'tasks' | 'subtasks'>('tasks');
  const { toast } = useToast();

  const filteredTasks = selectedMilestoneIds.size === 0
    ? milestones.flatMap(milestone => 
        milestone.tasks.map(task => ({
          ...task,
          milestoneTitle: milestone.title
        }))
      )
    : milestones
        .filter(m => selectedMilestoneIds.has(m.id))
        .flatMap(milestone => 
          milestone.tasks.map(task => ({
            ...task,
            milestoneTitle: milestone.title
          }))
        );

  const flattenedSubtasks = filteredTasks.flatMap(task => 
    (task.subtasks || []).map(subtask => ({
      ...subtask,
      parentTaskTitle: task.title,
      milestoneTitle: task.milestoneTitle,
      parentTaskId: task.id
    }))
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const [type, idStr] = draggableId.split('-');
    const newStatus = destination.droppableId;
    const numericId = parseInt(idStr, 10);

    if (type === 'task' && viewMode === 'tasks') {
      onStatusChange(numericId, newStatus);
      toast({
        title: "Task Updated",
        description: `Task status changed to ${columns.find(c => c.status === newStatus)?.label}`,
      });
    } else if (type === 'subtask' && viewMode === 'subtasks') {
      const subtask = flattenedSubtasks.find(st => st.id === numericId);
      if (subtask) {
        onSubtaskStatusChange(subtask.parentTaskId, numericId, newStatus);
        toast({
          title: "Subtask Updated",
          description: `Subtask status changed to ${columns.find(c => c.status === newStatus)?.label}`,
        });
      }
    }
  };

  const toggleMilestone = (milestoneId: number) => {
    setSelectedMilestoneIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(milestoneId)) {
        newSet.delete(milestoneId);
      } else {
        newSet.add(milestoneId);
      }
      return newSet;
    });
  };

  const currentItems = viewMode === 'tasks' ? filteredTasks : flattenedSubtasks;

  return (
    <div className="space-y-4">
      <MilestoneFilter
        milestones={milestones}
        selectedMilestoneIds={selectedMilestoneIds}
        onMilestoneToggle={toggleMilestone}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
          {columns.map(column => (
            <KanbanColumn
              key={column.status}
              {...column}
              items={currentItems.filter(item => item.status === column.status)}
              onTaskClick={onTaskClick}
              viewMode={viewMode}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};