import { KanbanItem } from "../types/kanban";

export interface KanbanColumnConfig {
  status: string;
  label: string;
  bgColor: string;
  textColor: string;
}

export interface DragEndResult {
  draggableId: string;
  destination?: {
    droppableId: string;
  };
}

export interface KanbanViewProps {
  milestones: {
    id: number;
    title: string;
    tasks: any[];
  }[];
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: any) => void;
  onSubtaskStatusChange: (taskId: number, subtaskId: number, newStatus: string) => void;
}

export interface KanbanContextProps {
  viewMode: 'tasks' | 'subtasks';
  onTaskClick: (task: any) => void;
}