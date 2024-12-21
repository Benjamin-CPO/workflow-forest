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
    'in-progress': tasks.filter(task => task.status === 'in-progress').length,
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

  if (statusCounts['in-progress'] > 0) {
    segments.push({
      color: 'bg-orange-500',
      percentage: (statusCounts['in-progress'] / total) * 100
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