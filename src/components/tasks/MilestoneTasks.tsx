import { TasksTable } from "./TasksTable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
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
}

export const MilestoneTasks = ({ milestones, onStatusChange, onTaskClick }: MilestoneTasksProps) => {
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
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};