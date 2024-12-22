import { Button } from "@/components/ui/button";
import { ViewControls } from "../ViewControls";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import { toast } from "sonner";

interface ViewControlsContainerProps {
  onAddTask: () => void;
  onAddMilestone: () => void;
  view: "list" | "kanban";
  setView: (view: "list" | "kanban") => void;
}

export const ViewControlsContainer = ({
  onAddTask,
  onAddMilestone,
  view,
  setView,
}: ViewControlsContainerProps) => {
  const { impersonatedUser } = useImpersonation();

  // Only allow admins and managers to add tasks or use voice features
  const canAddTasksOrUseVoice = !impersonatedUser || 
    ['admin', 'manager'].includes(impersonatedUser.role.toLowerCase());

  const handleAddTaskClick = () => {
    if (!canAddTasksOrUseVoice) {
      toast.error("You don't have permission to add tasks");
      return;
    }
    onAddTask();
  };

  const handleAddMilestoneClick = () => {
    if (!canAddTasksOrUseVoice) {
      toast.error("You don't have permission to add milestones");
      return;
    }
    onAddMilestone();
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="space-x-2">
        {canAddTasksOrUseVoice && (
          <>
            <Button onClick={handleAddTaskClick}>Add Task</Button>
            <Button onClick={handleAddMilestoneClick}>Add Milestone</Button>
          </>
        )}
      </div>
      <ViewControls view={view} setView={setView} />
    </div>
  );
};