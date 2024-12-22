import { SubTask, Task } from "@/types/project";

export interface TaskTableProps {
  tasks: Task[];
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onAddSubtask?: (taskId: number, subtask: SubTask) => void;
  onDeleteSubtask?: (taskId: number, subtaskId: number) => void;
  onSubtaskStatusChange?: (taskId: number, subtaskId: number, newStatus: string) => void;
  onAddTask?: () => void;
}

export interface SubtaskRowProps {
  subtask: SubTask;
  taskId: number;
  onStatusChange: (taskId: number, subtaskId: number, newStatus: string) => void;
  onDelete: (taskId: number, subtaskId: number) => void;
}

export interface TaskRowProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: (taskId: number) => void;
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
}

export interface NewSubtaskRowProps {
  taskId: number;
  newSubtaskTitle: string;
  onNewSubtaskTitleChange: (taskId: number, title: string) => void;
  onAddSubtask: (taskId: number) => void;
}