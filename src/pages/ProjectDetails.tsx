import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ProjectInfo } from "@/components/projects/ProjectInfo";
import { MilestoneManager } from "@/components/projects/MilestoneManager";
import { ChatSection } from "@/components/chat/ChatSection";

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
  
  const initialProject = (() => {
    const savedProjects = localStorage.getItem('projects');
    if (!savedProjects) return undefined;
    
    const projects = JSON.parse(savedProjects);
    return projects.find((p: Project) => p.id === projectId);
  })();
  
  const [project, setProject] = useState<Project | undefined>(initialProject);
  const [milestones, setMilestones] = useState(() => {
    const savedMilestones = localStorage.getItem(`project-${id}-milestones`);
    const projectMilestones = savedMilestones ? JSON.parse(savedMilestones) : project?.milestones || [];
    return [{ id: 0, title: "General", tasks: [] }, ...projectMilestones];
  });

  useEffect(() => {
    if (id) {
      localStorage.setItem(`project-${id}-milestones`, JSON.stringify(milestones.filter(m => m.id !== 0)));
    }
  }, [milestones, id]);

  const [isChatExpanded, setIsChatExpanded] = useState(true);

  const handleChatExpandChange = (expanded: boolean) => {
    setIsChatExpanded(expanded);
  };

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
      <ProjectInfo
        project={project}
        tasks={allTasks}
        milestones={milestones}
        onProjectUpdate={handleProjectUpdate}
      />
      <div className="flex gap-3 mt-6 h-[600px] relative">
        <div 
          className={`absolute left-0 transition-all duration-300 ${
            isChatExpanded ? 'w-[60%]' : 'w-[50px]'
          }`}
        >
          <ChatSection
            projectMilestones={milestones}
            className="h-full"
            collapsedWidth="50px"
            onExpandChange={handleChatExpandChange}
          />
        </div>
        <div 
          className={`transition-all duration-300 ml-auto ${
            isChatExpanded ? 'w-[38%]' : 'w-[calc(100%-70px)]'
          }`}
        >
          <MilestoneManager
            milestones={milestones.filter(m => m.id !== 0)}
            setMilestones={(newMilestones) => setMilestones([milestones[0], ...newMilestones])}
          />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ProjectDetails;