import { DragDropContext } from "@hello-pangea/dnd";
import { useState } from "react";
import { KanbanColumn } from "./kanban/KanbanColumn";
import { MilestoneFilter } from "./kanban/MilestoneFilter";
import { KanbanProvider } from "./kanban/KanbanContext";
import { useDragAndDrop } from "./kanban/useDragAndDrop";
import { columns } from "./kanban/config";
import { KanbanViewProps } from "./kanban/types";
import { KanbanItem } from "./types/kanban";

export const KanbanView = ({ 
  milestones, 
  onStatusChange, 
  onTaskClick,
  onSubtaskStatusChange 
}: KanbanViewProps) => {
  const [selectedMilestoneIds, setSelectedMilestoneIds] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'tasks' | 'subtasks'>('tasks');
  
  const { handleDragEnd } = useDragAndDrop(onStatusChange, onSubtaskStatusChange, viewMode);

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

  const currentItems = viewMode === 'tasks' ? filteredTasks : flattenedSubtasks;

  return (
    <div className="space-y-4">
      <MilestoneFilter
        milestones={milestones}
        selectedMilestoneIds={selectedMilestoneIds}
        onMilestoneToggle={(id) => {
          setSelectedMilestoneIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
              newSet.delete(id);
            } else {
              newSet.add(id);
            }
            return newSet;
          });
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <KanbanProvider value={{ viewMode, onTaskClick }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
            {columns.map(column => (
              <KanbanColumn
                key={column.status}
                {...column}
                items={currentItems.filter(item => item.status === column.status)}
              />
            ))}
          </div>
        </DragDropContext>
      </KanbanProvider>
    </div>
  );
};