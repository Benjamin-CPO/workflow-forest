import { Task, Milestone } from "@/types/project";
import { TasksTable } from "./TasksTable";

interface MilestoneTasksProps {
  milestones: Milestone[];
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onSubtaskStatusChange?: (taskId: number, subtaskId: number, newStatus: string) => void;
  onAddTask?: () => void;
}

export const MilestoneTasks = ({
  milestones,
  onStatusChange,
  onTaskClick,
  onDeleteTask,
  onSubtaskStatusChange,
  onAddTask,
}: MilestoneTasksProps) => {
  return (
    <div className="space-y-6">
      {milestones.map((milestone) => (
        <div key={milestone.id} className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">{milestone.title}</h3>
          <TasksTable
            tasks={milestone.tasks}
            onStatusChange={onStatusChange}
            onTaskClick={onTaskClick}
            onDeleteTask={onDeleteTask}
            onSubtaskStatusChange={onSubtaskStatusChange}
            onAddTask={onAddTask}
          />
        </div>
      ))}
    </div>
  );
};