export interface Client {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  clientId: number;
  status?: 'priority' | null;
  order?: number;
}

export interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  projectId: number;
}