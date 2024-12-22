import { useEffect } from "react";
import { ClientProjectsTable } from "./ClientProjectsTable";

export const ProjectList = () => {
  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (!storedProjects) {
      localStorage.setItem('projects', JSON.stringify([]));
    }
  }, []);

  return <ClientProjectsTable />;
};