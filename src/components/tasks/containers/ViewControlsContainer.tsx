import { ViewControls } from "../ViewControls";

interface ViewControlsContainerProps {
  onAddTask: () => void;
  onAddMilestone: () => void;
  view: "list" | "kanban";
  setView: (view: "list" | "kanban") => void;
  showAddTask?: boolean;
}

export const ViewControlsContainer = ({
  onAddTask,
  onAddMilestone,
  view,
  setView,
  showAddTask = true,
}: ViewControlsContainerProps) => {
  return (
    <ViewControls
      onAddTask={onAddTask}
      onAddMilestone={onAddMilestone}
      view={view}
      setView={setView}
      showAddTask={showAddTask}
    />
  );
};