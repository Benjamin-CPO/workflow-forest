import { TaskManagement } from "../tasks/TaskManagement";
import { Task, Milestone } from "@/types/project";

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