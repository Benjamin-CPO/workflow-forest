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

export interface SubTask {
  id: number;
  title: string;
  status: string;
}

export interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  projectId?: number;
  subtasks: SubTask[];
}

export interface Milestone {
  id: number;
  title: string;
  tasks: Task[];
}