import { Card, CardContent } from "@/components/ui/card";
import { TaskStatusSelect } from "@/components/TaskStatusSelect";

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
    { status: "pending", label: "Pending" },
    { status: "in-progress", label: "In Progress" },
    { status: "need-review", label: "Need Review" },
    { status: "need-revision", label: "Need Revision" },
    { status: "completed", label: "Completed" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
      {columns.map(column => (
        <div key={column.status} className="space-y-4">
          <div className="font-semibold text-sm">{column.label}</div>
          <div className="space-y-2">
            {allTasks
              .filter(task => task.status === column.status)
              .map(task => (
                <Card 
                  key={task.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onTaskClick(task)}
                >
                  <CardContent className="p-3 space-y-2">
                    <div className="font-medium text-sm">{task.title}</div>
                    <div className="text-xs text-muted-foreground">{task.milestoneTitle}</div>
                    <TaskStatusSelect
                      status={task.status}
                      onStatusChange={(newStatus) => onStatusChange(task.id, newStatus)}
                    />
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};