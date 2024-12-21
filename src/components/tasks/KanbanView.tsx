import { Card, CardContent } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
}

interface Milestone {
  id: number;
  title: string;
  tasks: Task[];
}

interface KanbanViewProps {
  milestones: Milestone[];
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
}

export const KanbanView = ({ milestones, onStatusChange, onTaskClick }: KanbanViewProps) => {
  const allTasks = milestones.flatMap(milestone => 
    milestone.tasks.map(task => ({
      ...task,
      milestoneTitle: milestone.title
    }))
  );

  const columns = [
    { status: "pending", label: "Pending", bgColor: "bg-gray-100", textColor: "text-gray-700" },
    { status: "in-progress", label: "In Progress", bgColor: "bg-orange-100", textColor: "text-orange-700" },
    { status: "need-review", label: "Need Review", bgColor: "bg-blue-100", textColor: "text-blue-700" },
    { status: "need-revision", label: "Need Revision", bgColor: "bg-red-100", textColor: "text-red-700" },
    { status: "completed", label: "Completed", bgColor: "bg-green-100", textColor: "text-green-700" }
  ];

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    const taskId = parseInt(draggableId);

    onStatusChange(taskId, newStatus);
  };

  return (
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
                  {allTasks
                    .filter(task => task.status === column.status)
                    .map((task, index) => (
                      <Draggable 
                        key={task.id} 
                        draggableId={task.id.toString()} 
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
                              onClick={() => onTaskClick(task)}
                            >
                              <CardContent className="p-3 space-y-2">
                                <div className="font-medium text-sm">{task.title}</div>
                                <div className="text-xs text-muted-foreground">{task.milestoneTitle}</div>
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
  );
};