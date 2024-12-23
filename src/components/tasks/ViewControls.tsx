import { Button } from "@/components/ui/button";
import { Plus, List, Kanban } from "lucide-react";

interface ViewControlsProps {
  onAddTask: () => void;
  onAddMilestone: () => void;
  view: "list" | "kanban";
  setView: (view: "list" | "kanban") => void;
  showAddTask?: boolean;
}

export const ViewControls = ({
  onAddTask,
  onAddMilestone,
  view,
  setView,
  showAddTask = true,
}: ViewControlsProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="space-x-2">
        {showAddTask && (
          <Button onClick={onAddTask} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        )}
        <Button onClick={onAddMilestone} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Milestone
        </Button>
      </div>
      <div className="space-x-2">
        <Button
          variant={view === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("list")}
        >
          <List className="h-4 w-4 mr-2" />
          List
        </Button>
        <Button
          variant={view === "kanban" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("kanban")}
        >
          <Kanban className="h-4 w-4 mr-2" />
          Kanban
        </Button>
      </div>
    </div>
  );
};