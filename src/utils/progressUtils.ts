interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
}

export const calculateProgressColors = (tasks: Task[]) => {
  if (tasks.length === 0) return [];

  const statusCounts = {
    pending: tasks.filter(task => task.status === 'pending').length,
    'need-revision': tasks.filter(task => task.status === 'need-revision').length,
    'in-progress': tasks.filter(task => task.status === 'in-progress').length,
    'need-review': tasks.filter(task => task.status === 'need-review').length,
    completed: tasks.filter(task => task.status === 'completed').length,
  };

  const total = tasks.length;
  const segments = [];

  if (statusCounts.completed > 0) {
    segments.push({
      color: 'bg-green-500',
      percentage: (statusCounts.completed / total) * 100
    });
  }

  if (statusCounts['need-review'] > 0) {
    segments.push({
      color: 'bg-blue-500',
      percentage: (statusCounts['need-review'] / total) * 100
    });
  }

  if (statusCounts['in-progress'] > 0) {
    segments.push({
      color: 'bg-orange-500',
      percentage: (statusCounts['in-progress'] / total) * 100
    });
  }

  if (statusCounts['need-revision'] > 0) {
    segments.push({
      color: 'bg-red-500',
      percentage: (statusCounts['need-revision'] / total) * 100
    });
  }

  if (statusCounts.pending > 0) {
    segments.push({
      color: 'bg-gray-300',
      percentage: (statusCounts.pending / total) * 100
    });
  }

  return segments;
};