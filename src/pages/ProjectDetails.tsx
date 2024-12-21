import { Toaster } from "@/components/ui/toaster";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectProgress } from "@/components/projects/ProjectProgress";
import { TaskManagement } from "@/components/tasks/TaskManagement";
import { ChatSection } from "@/components/chat/ChatSection";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
}

interface Milestone {
  id: number;
  title: string;
  tasks: Task[];
}

interface Project {
  id: number;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  figmaWorkfile?: string;
  figmaReviewFile?: string;
  milestones: Milestone[];
}

const ProjectDetails = () => {
  const { id } = useParams();
  const projectId = Number(id);
  
  // Get project from localStorage instead of hardcoded array
  const initialProject = (() => {
    const savedProjects = localStorage.getItem('projects');
    if (!savedProjects) return undefined;
    
    const projects = JSON.parse(savedProjects);
    return projects.find((p: Project) => p.id === projectId);
  })();
  
  const [project, setProject] = useState<Project | undefined>(initialProject);
  const [milestones, setMilestones] = useState(() => {
    const savedMilestones = localStorage.getItem(`project-${id}-milestones`);
    return savedMilestones ? JSON.parse(savedMilestones) : project?.milestones || [];
  });
  const [isChatExpanded, setIsChatExpanded] = useState(true);

  useEffect(() => {
    if (id) {
      localStorage.setItem(`project-${id}-milestones`, JSON.stringify(milestones));
    }
  }, [milestones, id]);

  if (!project) {
    return <div className="container py-6">Project not found</div>;
  }

  const allTasks = milestones.flatMap(milestone => milestone.tasks);

  const handleProjectUpdate = (data: { 
    title: string; 
    description: string; 
    dueDate: string;
    figmaWorkfile?: string;
    figmaReviewFile?: string;
  }) => {
    setProject({
      ...project,
      ...data
    });

    const savedProjects = localStorage.getItem('projects');
    const allProjects = savedProjects ? JSON.parse(savedProjects) : [];
    const updatedProjects = allProjects.map((p: Project) =>
      p.id === projectId ? { ...p, ...data } : p
    );
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  return (
    <div className="container py-6 min-h-screen flex flex-col">
      <ProjectHeader 
        title={project.title}
        description={project.description}
        dueDate={project.dueDate}
        figmaWorkfile={project.figmaWorkfile}
        figmaReviewFile={project.figmaReviewFile}
        progress={allTasks.length > 0 ? (allTasks.filter(t => t.status === "completed").length / allTasks.length) * 100 : 0}
        onUpdate={handleProjectUpdate}
      />

      <div className="mt-6">
        <ProjectProgress tasks={allTasks} />
      </div>

      <div className="flex gap-6 mt-6 flex-1 min-h-0">
        <ChatSection 
          projectMilestones={milestones} 
          className="w-[60%] transition-all duration-300"
          collapsedWidth="50px"
          onExpandChange={setIsChatExpanded}
        />
        <div className={`transition-all duration-300 ${isChatExpanded ? 'w-[40%]' : 'flex-1'}`}>
          <TaskManagement 
            milestones={milestones}
            setMilestones={setMilestones}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;