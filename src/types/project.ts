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
  assigneeId?: number;
}

export interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  projectId?: number;
  subtasks: SubTask[];
  assigneeId?: number;
}

export interface Milestone {
  id: number;
  title: string;
  tasks: Task[];
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
}