import { Task, Milestone } from "@/types/project";
import { TasksTable } from "./TasksTable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface MilestoneTasksProps {
  milestones: Milestone[];
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onSubtaskStatusChange?: (taskId: number, subtaskId: number, newStatus: string) => void;
  onAddTask?: () => void;
}

export const MilestoneTasks = ({
  milestones,
  onStatusChange,
  onTaskClick,
  onDeleteTask,
  onSubtaskStatusChange,
  onAddTask,
}: MilestoneTasksProps) => {
  const getMilestoneProgress = (tasks: Task[]) => {
    const completedTasks = tasks.filter(task => task.status === "completed").length;
    return tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  };

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {milestones.map((milestone) => (
        <AccordionItem 
          key={milestone.id} 
          value={milestone.id.toString()}
          className="border rounded-lg bg-white shadow"
        >
          <AccordionTrigger className="hover:no-underline px-4">
            <div className="flex items-center gap-4">
              <span>{milestone.title}</span>
              <Badge variant="secondary">
                {getMilestoneProgress(milestone.tasks)}% Complete
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <TasksTable
              tasks={milestone.tasks}
              onStatusChange={onStatusChange}
              onTaskClick={onTaskClick}
              onDeleteTask={onDeleteTask}
              onSubtaskStatusChange={onSubtaskStatusChange}
              onAddTask={onAddTask}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};