import { Task, Milestone } from "@/types/project";
import { MilestoneTasks } from "./MilestoneTasks";
import { KanbanView } from "./KanbanView";

interface TaskViewContentProps {
  view: "list" | "kanban";
  milestones: Milestone[];
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onSubtaskStatusChange: (taskId: number, subtaskId: number, newStatus: string) => void;
  onAddSubtask: (taskId: number, subtask: { id: number; title: string; status: string }) => void;
  onDeleteSubtask: (taskId: number, subtaskId: number) => void;
  onAddTask: () => void;
}

export const TaskViewContent = ({
  view,
  milestones,
  onStatusChange,
  onTaskClick,
  onDeleteTask,
  onSubtaskStatusChange,
  onAddSubtask,
  onDeleteSubtask,
  onAddTask,
}: TaskViewContentProps) => {
  return (
    <div className="flex-1 overflow-auto">
      {view === "list" ? (
        <MilestoneTasks
          milestones={milestones}
          onStatusChange={onStatusChange}
          onTaskClick={onTaskClick}
          onDeleteTask={onDeleteTask}
          onSubtaskStatusChange={onSubtaskStatusChange}
          onAddSubtask={onAddSubtask}
          onDeleteSubtask={onDeleteSubtask}
          onAddTask={onAddTask}
        />
      ) : (
        <KanbanView
          milestones={milestones}
          onStatusChange={onStatusChange}
          onTaskClick={onTaskClick}
          onSubtaskStatusChange={onSubtaskStatusChange}
        />
      )}
    </div>
  );
};