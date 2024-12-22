import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Kanban } from "lucide-react";

interface ViewControlsProps {
  view: "list" | "kanban";
  setView: (view: "list" | "kanban") => void;
  onAddTask: () => void;
  onAddMilestone: () => void;
}

export const ViewControls = ({ view, setView, onAddTask, onAddMilestone }: ViewControlsProps) => {
  return (
    <div className="sticky top-0 bg-background z-10 p-4 border-b">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <ToggleGroup 
            type="single" 
            value={view} 
            onValueChange={(value) => value && setView(value as "list" | "kanban")}
          >
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="kanban" aria-label="Kanban view">
              <Kanban className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex gap-2">
          <Button onClick={onAddTask}>Add Task</Button>
          <Button variant="outline" onClick={onAddMilestone}>
            Add Milestone
          </Button>
        </div>
      </div>
    </div>
  );
};