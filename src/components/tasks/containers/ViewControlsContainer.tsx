import { useState } from "react";
import { ViewControls } from "../ViewControls";

interface ViewControlsContainerProps {
  onAddTask: () => void;
  onAddMilestone: () => void;
}

export const ViewControlsContainer = ({
  onAddTask,
  onAddMilestone,
}: ViewControlsContainerProps) => {
  const [view, setView] = useState<"list" | "kanban">("list");

  return (
    <ViewControls
      view={view}
      setView={setView}
      onAddTask={onAddTask}
      onAddMilestone={onAddMilestone}
    />
  );
};