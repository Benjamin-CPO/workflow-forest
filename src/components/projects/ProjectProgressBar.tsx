import { cn } from "@/lib/utils";
import { MultiColorProgress } from "@/components/ui/multi-color-progress";
import { ProgressSegment } from "./progress/ProgressSegment";
import { StatusLabel } from "./progress/StatusLabel";
import { useProgressCalculation } from "./progress/useProgressCalculation";

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

interface ProjectProgressBarProps {
  milestones: Milestone[];
  className?: string;
}

export const ProjectProgressBar = ({ milestones, className }: ProjectProgressBarProps) => {
  const allTasks = milestones.flatMap(milestone => milestone.tasks);
  
  if (allTasks.length === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        No tasks available to show progress
      </div>
    );
  }

  const { statusCounts, segments, completionPercentage } = useProgressCalculation(allTasks);

  const statusLabels = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    'need-revision': 'Need Revision',
    'pending-feedback': 'Pending Feedback',
    completed: 'Completed'
  };

  const statusColors = {
    pending: 'bg-gray-300',
    'in-progress': 'bg-blue-500',
    'need-revision': 'bg-red-500',
    'pending-feedback': 'bg-yellow-500',
    completed: 'bg-green-500'
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">Overall Progress</div>
        <div className="text-sm text-muted-foreground">
          {completionPercentage}% Complete
        </div>
      </div>
      
      <MultiColorProgress
        value={100}
        className="h-2.5"
        segments={segments}
      />
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-3 text-sm">
        {Object.entries(statusCounts).map(([status, count]) => (
          count > 0 && (
            <StatusLabel
              key={status}
              color={statusColors[status as keyof typeof statusColors]}
              label={statusLabels[status as keyof typeof statusLabels]}
              percentage={Number(((count / allTasks.length) * 100).toFixed(1))}
            />
          )
        ))}
      </div>
    </div>
  );
};