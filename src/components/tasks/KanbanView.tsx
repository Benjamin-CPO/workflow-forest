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
}

const columns = [
  { status: "pending", label: "Pending", bgColor: "bg-gray-100", textColor: "text-gray-700" },
  { status: "need-revision", label: "Need Revision", bgColor: "bg-red-100", textColor: "text-red-700" },
  { status: "in-progress", label: "In Progress", bgColor: "bg-orange-100", textColor: "text-orange-700" },
  { status: "need-feedback", label: "Need Feedback", bgColor: "bg-blue-100", textColor: "text-blue-700" },
  { status: "completed", label: "Completed", bgColor: "bg-green-100", textColor: "text-green-700" }
];

export const KanbanView = ({ milestones, onStatusChange, onTaskClick }: KanbanViewProps) => {
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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;

    if (viewMode === 'subtasks') {
      const subtask = flattenedSubtasks.find(st => st.id === taskId);
      if (subtask) {
        const parentTask = filteredTasks.find(t => t.id === subtask.parentTaskId);
        if (parentTask && parentTask.subtasks) {
          // Update the subtask status
          const updatedSubtasks = parentTask.subtasks.map(st =>
            st.id === taskId ? { ...st, status: newStatus } : st
          );
          
          // Update the parent task with the modified subtasks
          const updatedParentTask = {
            ...parentTask,
            subtasks: updatedSubtasks
          };

          // Call onStatusChange with the updated parent task
          onStatusChange(parentTask.id, updatedParentTask.status);
          
          toast({
            title: "Status Updated",
            description: `Subtask status changed to ${columns.find(c => c.status === newStatus)?.label}`,
          });
        }
      }
    } else {
      onStatusChange(taskId, newStatus);
      toast({
        title: "Status Updated",
        description: `Task status changed to ${columns.find(c => c.status === newStatus)?.label}`,
      });
    }
  };

  const items = viewMode === 'tasks' ? filteredTasks : flattenedSubtasks;

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
              items={items.filter(item => item.status === column.status)}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};