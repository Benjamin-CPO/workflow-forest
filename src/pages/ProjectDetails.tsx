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

const projects = [
  {
    id: 1,
    title: "Website Redesign",
    description: "Complete overhaul of the company website with new branding",
    progress: 75,
    dueDate: "Mar 15, 2024",
    figmaWorkfile: "https://figma.com/file/example-workfile",
    figmaReviewFile: "https://figma.com/file/example-review",
    milestones: [
      {
        id: 1,
        title: "Design Phase",
        tasks: [
          { id: 1, title: "Design Homepage", status: "completed", dueDate: "Mar 10, 2024" },
          { id: 2, title: "Design Mobile Layout", status: "in-progress", dueDate: "Mar 12, 2024" },
        ],
      },
      {
        id: 2,
        title: "Development Phase",
        tasks: [
          { id: 3, title: "Implement Contact Form", status: "in-progress", dueDate: "Mar 12, 2024" },
          { id: 4, title: "Mobile Responsiveness", status: "pending", dueDate: "Mar 14, 2024" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "Create a new mobile app for customer engagement",
    progress: 30,
    dueDate: "Apr 1, 2024",
    figmaWorkfile: "https://figma.com/file/example-workfile",
    figmaReviewFile: "https://figma.com/file/example-review",
    milestones: [
      {
        id: 1,
        title: "Planning Phase",
        tasks: [
          { id: 1, title: "UI/UX Design", status: "completed", dueDate: "Mar 20, 2024" },
          { id: 2, title: "Backend Integration", status: "pending", dueDate: "Mar 25, 2024" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Marketing Campaign",
    description: "Q2 marketing campaign for product launch",
    progress: 50,
    dueDate: "Mar 30, 2024",
    figmaWorkfile: "https://figma.com/file/example-workfile",
    figmaReviewFile: "https://figma.com/file/example-review",
    milestones: [
      {
        id: 1,
        title: "Campaign Planning",
        tasks: [
          { id: 1, title: "Content Creation", status: "in-progress", dueDate: "Mar 25, 2024" },
          { id: 2, title: "Social Media Strategy", status: "pending", dueDate: "Mar 28, 2024" },
        ],
      },
    ],
  },
];

const ProjectDetails = () => {
  const { id } = useParams();
  const projectId = Number(id);
  const initialProject = projects.find((p) => p.id === projectId);
  
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
    return <div>Project not found</div>;
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
    const allProjects = savedProjects ? JSON.parse(savedProjects) : projects;
    const updatedProjects = allProjects.map((p: Project) =>
      p.id === projectId ? { ...p, ...data } : p
    );
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  return (
    <div className="container py-6">
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

      <div className="flex gap-6 mt-6 w-full">
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