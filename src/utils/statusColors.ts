export const statusColors = {
  pending: {
    bg: 'bg-gray-100',
    text: 'text-gray-700'
  },
  'in-progress': {
    bg: 'bg-orange-100',
    text: 'text-orange-700'
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-700'
  }
};

export const getProjectStatus = (progress: number) => {
  if (progress === 100) return 'completed';
  if (progress > 0) return 'in-progress';
  return 'pending';
};