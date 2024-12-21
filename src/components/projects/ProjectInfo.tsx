import { ProjectHeader } from "./ProjectHeader";
import { ProjectProgressBar } from "./ProjectProgressBar";

interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  figmaWorkfile?: string;
  figmaReviewFile?: string;
}

interface Milestone {
  id: number;
  title: string;
  tasks: Task[];
}

interface ProjectInfoProps {
  project: Project;
  tasks: Task[];
  milestones: Milestone[];
  onProjectUpdate: (data: {
    title: string;
    description: string;
    dueDate: string;
    figmaWorkfile?: string;
    figmaReviewFile?: string;
  }) => void;
}

export const ProjectInfo = ({ project, tasks, milestones, onProjectUpdate }: ProjectInfoProps) => {
  return (
    <div className="space-y-6">
      <ProjectHeader
        title={project.title}
        description={project.description}
        dueDate={project.dueDate}
        figmaWorkfile={project.figmaWorkfile}
        figmaReviewFile={project.figmaReviewFile}
        progress={tasks.length > 0 ? (tasks.filter(t => t.status === "completed").length / tasks.length) * 100 : 0}
        onUpdate={onProjectUpdate}
      />
      <div className="bg-accent rounded-lg p-6">
        <ProjectProgressBar milestones={milestones} />
      </div>
    </div>
  );
};