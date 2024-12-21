import { TaskManagement } from "../tasks/TaskManagement";

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

interface MilestoneManagerProps {
  milestones: Milestone[];
  setMilestones: (milestones: Milestone[]) => void;
}

export const MilestoneManager = ({ milestones, setMilestones }: MilestoneManagerProps) => {
  return (
    <div className="mt-8">
      <TaskManagement
        milestones={milestones}
        setMilestones={setMilestones}
      />
    </div>
  );
};