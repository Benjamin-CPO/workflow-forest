import { useMemo } from 'react';

interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
}

interface StatusCount {
  [key: string]: number;
}

export const useProgressCalculation = (tasks: Task[]) => {
  return useMemo(() => {
    if (tasks.length === 0) {
      return {
        statusCounts: {},
        segments: [],
        completionPercentage: 0,
      };
    }

    const statusCounts: StatusCount = {
      pending: tasks.filter(task => task.status === 'pending').length,
      'in-progress': tasks.filter(task => task.status === 'in-progress').length,
      'need-revision': tasks.filter(task => task.status === 'need-revision').length,
      'pending-feedback': tasks.filter(task => task.status === 'pending-feedback').length,
      completed: tasks.filter(task => task.status === 'completed').length,
    };

    const totalTasks = tasks.length;
    const calculatePercentage = (count: number) => 
      Number(((count / totalTasks) * 100).toFixed(1));

    const segments = [
      { color: 'bg-gray-300', percentage: calculatePercentage(statusCounts.pending) },
      { color: 'bg-blue-500', percentage: calculatePercentage(statusCounts['in-progress']) },
      { color: 'bg-red-500', percentage: calculatePercentage(statusCounts['need-revision']) },
      { color: 'bg-yellow-500', percentage: calculatePercentage(statusCounts['pending-feedback']) },
      { color: 'bg-green-500', percentage: calculatePercentage(statusCounts.completed) },
    ].filter(segment => segment.percentage > 0);

    return {
      statusCounts,
      segments,
      completionPercentage: calculatePercentage(statusCounts.completed),
    };
  }, [tasks]);
};