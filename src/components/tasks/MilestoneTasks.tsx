import { TasksTable } from "./TasksTable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface SubTask {
  id: number;
  title: string;
  status: string;
}

interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  subtasks?: SubTask[];
}

interface Milestone {
  id: number;
  title: string;
  tasks: Task[];
}

interface MilestoneTasksProps {
  milestones: Milestone[];
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onAddSubtask?: (taskId: number, subtask: { title: string; status: string }) => void;
  onDeleteSubtask?: (taskId: number, subtaskId: number) => void;
  onSubtaskStatusChange?: (taskId: number, subtaskId: number, newStatus: string) => void;
}

export const MilestoneTasks = ({ 
  milestones, 
  onStatusChange, 
  onTaskClick,
  onDeleteTask,
  onAddSubtask,
  onDeleteSubtask,
  onSubtaskStatusChange
}: MilestoneTasksProps) => {
  const getMilestoneProgress = (tasks: Task[]) => {
    const completedTasks = tasks.filter(task => task.status === "completed").length;
    return tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {milestones.map((milestone) => (
        <AccordionItem key={milestone.id} value={milestone.id.toString()}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-4">
              <span>{milestone.title}</span>
              <Badge variant="secondary">
                {getMilestoneProgress(milestone.tasks)}% Complete
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <TasksTable
              tasks={milestone.tasks}
              onStatusChange={onStatusChange}
              onTaskClick={onTaskClick}
              onDeleteTask={onDeleteTask}
              onAddSubtask={onAddSubtask}
              onDeleteSubtask={onDeleteSubtask}
              onSubtaskStatusChange={onSubtaskStatusChange}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};