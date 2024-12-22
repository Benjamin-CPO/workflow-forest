import { Card, CardContent } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  subtasks?: SubTask[];
}

interface SubTask {
  id: number;
  title: string;
  status: string;
}

interface Milestone {
  id: number;
  title: string;
  tasks: Task[];
}

interface TaskWithMilestone extends Task {
  milestoneTitle: string;
}

interface SubTaskWithParent extends SubTask {
  parentTaskTitle: string;
  milestoneTitle: string;
}

type KanbanItem = TaskWithMilestone | SubTaskWithParent;

interface KanbanViewProps {
  milestones: Milestone[];
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
}

const isSubtaskWithParent = (item: KanbanItem): item is SubTaskWithParent => {
  return 'parentTaskTitle' in item;
};

export const KanbanView = ({ milestones, onStatusChange, onTaskClick }: KanbanViewProps) => {
  const [selectedMilestoneIds, setSelectedMilestoneIds] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'tasks' | 'subtasks'>('tasks');

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
      milestoneTitle: task.milestoneTitle
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

  const columns = [
    { status: "pending", label: "Pending", bgColor: "bg-gray-100", textColor: "text-gray-700" },
    { status: "need-revision", label: "Need Revision", bgColor: "bg-red-100", textColor: "text-red-700" },
    { status: "in-progress", label: "In Progress", bgColor: "bg-orange-100", textColor: "text-orange-700" },
    { status: "need-feedback", label: "Need Feedback", bgColor: "bg-blue-100", textColor: "text-blue-700" },
    { status: "completed", label: "Completed", bgColor: "bg-green-100", textColor: "text-green-700" }
  ];

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const taskId = parseInt(draggableId);

    onStatusChange(taskId, destination.droppableId);
  };

  return (
    <div className="space-y-4">
      <div className="pt-8 px-4 border-t space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto">
            {milestones.map(milestone => (
              <Button
                key={milestone.id}
                variant={selectedMilestoneIds.has(milestone.id) ? "default" : "outline"}
                onClick={() => toggleMilestone(milestone.id)}
                className="whitespace-nowrap"
              >
                {milestone.title}
              </Button>
            ))}
          </div>
          <ToggleGroup 
            type="single" 
            value={viewMode}
            onValueChange={(value) => value && setViewMode(value as 'tasks' | 'subtasks')}
            className="border rounded-lg"
          >
            <ToggleGroupItem value="tasks" aria-label="View tasks">
              Tasks
            </ToggleGroupItem>
            <ToggleGroupItem value="subtasks" aria-label="View subtasks">
              Subtasks
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
          {columns.map(column => (
            <div key={column.status} className={`space-y-4 ${column.bgColor} rounded-lg p-4`}>
              <div className={`font-semibold text-sm p-2 rounded-lg ${column.textColor}`}>
                {column.label}
              </div>
              <Droppable droppableId={column.status}>
                {(provided) => (
                  <div 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2 min-h-[100px]"
                  >
                    {(viewMode === 'tasks' ? filteredTasks : flattenedSubtasks)
                      .filter(item => item.status === column.status)
                      .map((item, index) => (
                        <Draggable 
                          key={item.id} 
                          draggableId={item.id.toString()} 
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card 
                                className="cursor-pointer hover:shadow-md transition-shadow bg-white"
                                onClick={() => viewMode === 'tasks' && onTaskClick(item as Task)}
                              >
                                <CardContent className="p-3 space-y-2">
                                  <div className="font-medium text-sm">{item.title}</div>
                                  {isSubtaskWithParent(item) ? (
                                    <div className="space-y-1">
                                      <div className="text-xs text-muted-foreground">
                                        {item.milestoneTitle}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        Task: {item.parentTaskTitle}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-muted-foreground">
                                      {item.milestoneTitle}
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};