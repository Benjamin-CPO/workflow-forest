import { MultiColorProgress } from "@/components/ui/multi-color-progress";
import { calculateProgressColors } from "@/utils/progressUtils";

interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
}

interface ProjectProgressProps {
  tasks: Task[];
}

export const ProjectProgress = ({ tasks }: ProjectProgressProps) => {
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  const progressSegments = calculateProgressColors(tasks);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Progress ({completedTasks} of {tasks.length} tasks completed)
        </span>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <MultiColorProgress segments={progressSegments} className="h-2" />
    </div>
  );
};