import { ProjectCard } from "./ProjectCard";

const projects = [
  {
    id: 1,
    title: "Website Redesign",
    description: "Complete overhaul of the company website with new branding",
    progress: 75,
    dueDate: "Mar 15, 2024",
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "Create a new mobile app for customer engagement",
    progress: 30,
    dueDate: "Apr 1, 2024",
  },
  {
    id: 3,
    title: "Marketing Campaign",
    description: "Q2 marketing campaign for product launch",
    progress: 50,
    dueDate: "Mar 30, 2024",
  },
];

export const ProjectList = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
};