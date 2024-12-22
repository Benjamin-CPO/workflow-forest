import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Milestone } from "@/types/project";

interface MilestoneFilterProps {
  milestones: Milestone[];
  selectedMilestoneIds: Set<number>;
  onMilestoneToggle: (milestoneId: number) => void;
  viewMode: 'tasks' | 'subtasks';
  onViewModeChange: (value: 'tasks' | 'subtasks') => void;
}

export const MilestoneFilter = ({
  milestones,
  selectedMilestoneIds,
  onMilestoneToggle,
  viewMode,
  onViewModeChange,
}: MilestoneFilterProps) => {
  return (
    <div className="pt-8 px-4 border-t space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {milestones.map(milestone => (
            <Button
              key={milestone.id}
              variant={selectedMilestoneIds.has(milestone.id) ? "default" : "outline"}
              onClick={() => onMilestoneToggle(milestone.id)}
              className="whitespace-nowrap"
            >
              {milestone.title}
            </Button>
          ))}
        </div>
        <ToggleGroup 
          type="single" 
          value={viewMode}
          onValueChange={(value) => value && onViewModeChange(value as 'tasks' | 'subtasks')}
          className="border rounded-lg"
        >
          <ToggleGroupItem value="tasks" aria-label="View tasks">
            Tasks
          </ToggleGroupItem>
          <ToggleGroupItem value="subtasks" aria-label="View subtasks">
            Subtasks
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};