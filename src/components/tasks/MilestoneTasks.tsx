import { Milestone, Task, SubTask } from "@/types/project";
import { TasksTable } from "./TasksTable";

interface MilestoneTasksProps {
  milestones: Milestone[];
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onSubtaskStatusChange?: (taskId: number, subtaskId: number, newStatus: string) => void;
  onAddTask?: () => void;
  onAddSubtask?: (taskId: number, subtask: SubTask) => void;
  onDeleteSubtask?: (taskId: number, subtaskId: number) => void;
}

export const MilestoneTasks = ({
  milestones,
  onStatusChange,
  onTaskClick,
  onDeleteTask,
  onSubtaskStatusChange,
  onAddTask,
  onAddSubtask,
  onDeleteSubtask,
}: MilestoneTasksProps) => {
  return (
    <div className="space-y-6">
      {milestones.map((milestone) => (
        <div key={milestone.id} className="space-y-4">
          <h3 className="text-lg font-semibold">{milestone.title}</h3>
          <TasksTable
            tasks={milestone.tasks}
            onStatusChange={onStatusChange}
            onTaskClick={onTaskClick}
            onDeleteTask={onDeleteTask}
            onAddSubtask={onAddSubtask}
            onDeleteSubtask={onDeleteSubtask}
            onSubtaskStatusChange={onSubtaskStatusChange}
            onAddTask={onAddTask}
          />
        </div>
      ))}
    </div>
  );
};