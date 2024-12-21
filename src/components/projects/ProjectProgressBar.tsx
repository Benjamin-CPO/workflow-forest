import { MultiColorProgress } from "@/components/ui/multi-color-progress";

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
}

export const ProjectProgressBar = ({ milestones }: ProjectProgressBarProps) => {
  const allTasks = milestones.flatMap(milestone => milestone.tasks);
  const totalTasks = allTasks.length;

  if (totalTasks === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No tasks available to show progress
      </div>
    );
  }

  const statusCounts = {
    pending: allTasks.filter(task => task.status === 'pending').length,
    'need-revision': allTasks.filter(task => task.status === 'need-revision').length,
    'in-progress': allTasks.filter(task => task.status === 'in-progress').length,
    'need-feedback': allTasks.filter(task => task.status === 'need-feedback').length,
    completed: allTasks.filter(task => task.status === 'completed').length,
  };

  const segments = [
    {
      color: 'bg-gray-300',
      percentage: (statusCounts.pending / totalTasks) * 100
    },
    {
      color: 'bg-red-500',
      percentage: (statusCounts['need-revision'] / totalTasks) * 100
    },
    {
      color: 'bg-orange-500',
      percentage: (statusCounts['in-progress'] / totalTasks) * 100
    },
    {
      color: 'bg-blue-500',
      percentage: (statusCounts['need-feedback'] / totalTasks) * 100
    },
    {
      color: 'bg-green-500',
      percentage: (statusCounts.completed / totalTasks) * 100
    }
  ].filter(segment => segment.percentage > 0);

  const completionPercentage = Math.round((statusCounts.completed / totalTasks) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">Overall Progress</div>
        <div className="text-sm text-muted-foreground">{completionPercentage}% Complete</div>
      </div>
      <MultiColorProgress
        value={100}
        className="h-2"
        segments={segments}
      />
      <div className="flex flex-wrap gap-4 text-sm">
        {Object.entries(statusCounts).map(([status, count]) => (
          count > 0 && (
            <div key={status} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                status === 'pending' ? 'bg-gray-300' :
                status === 'need-revision' ? 'bg-red-500' :
                status === 'in-progress' ? 'bg-orange-500' :
                status === 'need-feedback' ? 'bg-blue-500' :
                'bg-green-500'
              }`} />
              <span className="capitalize">{status.replace('-', ' ')}</span>
              <span className="text-muted-foreground">({Math.round((count / totalTasks) * 100)}%)</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
};