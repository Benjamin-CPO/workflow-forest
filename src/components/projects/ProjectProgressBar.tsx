import { MultiColorProgress } from "@/components/ui/multi-color-progress";
import { cn } from "@/lib/utils";

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
  const totalTasks = allTasks.length;

  if (totalTasks === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        No tasks available to show progress
      </div>
    );
  }

  // Calculate exact counts for each status
  const statusCounts = {
    pending: allTasks.filter(task => task.status === 'pending').length,
    'in-progress': allTasks.filter(task => task.status === 'in-progress').length,
    'need-revision': allTasks.filter(task => task.status === 'need-revision').length,
    'pending-feedback': allTasks.filter(task => task.status === 'pending-feedback').length,
    completed: allTasks.filter(task => task.status === 'completed').length,
  };

  // Calculate exact percentages with one decimal place
  const calculatePercentage = (count: number) => {
    return Number(((count / totalTasks) * 100).toFixed(1));
  };

  const segments = [
    {
      color: 'bg-gray-300',
      percentage: calculatePercentage(statusCounts.pending)
    },
    {
      color: 'bg-blue-500',
      percentage: calculatePercentage(statusCounts['in-progress'])
    },
    {
      color: 'bg-red-500',
      percentage: calculatePercentage(statusCounts['need-revision'])
    },
    {
      color: 'bg-yellow-500',
      percentage: calculatePercentage(statusCounts['pending-feedback'])
    },
    {
      color: 'bg-green-500',
      percentage: calculatePercentage(statusCounts.completed)
    }
  ].filter(segment => segment.percentage > 0);

  const completionPercentage = calculatePercentage(statusCounts.completed);

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
            <div key={status} className="flex items-center gap-2">
              <div 
                className={cn(
                  "w-3 h-3 rounded-full",
                  statusColors[status as keyof typeof statusColors]
                )} 
              />
              <span className="text-sm font-medium">
                {statusLabels[status as keyof typeof statusLabels]}
              </span>
              <span className="text-sm text-muted-foreground">
                ({calculatePercentage(count)}%)
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
};