import { Task, SubTask } from "@/types/project";

export interface TaskWithMilestone extends Task {
  milestoneTitle: string;
}

export interface SubTaskWithParent extends SubTask {
  parentTaskTitle: string;
  milestoneTitle: string;
  parentTaskId: number;
}

export type KanbanItem = TaskWithMilestone | SubTaskWithParent;

export const isSubtaskWithParent = (item: KanbanItem): item is SubTaskWithParent => {
  return 'parentTaskTitle' in item;
};