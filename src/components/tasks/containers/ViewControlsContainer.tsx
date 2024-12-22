import { ViewControls } from "../ViewControls";

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
  return (
    <ViewControls
      view={view}
      setView={setView}
      onAddTask={onAddTask}
      onAddMilestone={onAddMilestone}
    />
  );
};