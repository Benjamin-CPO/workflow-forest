import { ProjectHeader } from "./ProjectHeader";

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

interface ProjectInfoProps {
  project: Project;
  tasks: Task[];
  onProjectUpdate: (data: {
    title: string;
    description: string;
    dueDate: string;
    figmaWorkfile?: string;
    figmaReviewFile?: string;
  }) => void;
}

export const ProjectInfo = ({ project, tasks, onProjectUpdate }: ProjectInfoProps) => {
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
    </div>
  );
};