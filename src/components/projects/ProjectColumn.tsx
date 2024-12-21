import { Client, Project, Task } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { Droppable, Draggable } from '@hello-pangea/dnd';

interface ProjectColumnProps {
  client: Client;
  projects: Project[];
  tasks: Task[];
}

export const ProjectColumn = ({ client, projects, tasks }: ProjectColumnProps) => {
  const getProjectTasks = (projectId: number) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  return (
    <td className="p-2 min-w-[250px] w-[250px]">
      <Droppable droppableId={client.id.toString()}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2"
          >
            {projects.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No projects {client.id === -1 ? 'without client' : 'for this client'}
              </div>
            ) : (
              projects
                .filter((project): project is Project => 
                  project !== undefined && project !== null && typeof project.id === 'number'
                )
                .map((project, index) => {
                  const projectTasks = getProjectTasks(project.id);
                  const progress = projectTasks.length > 0 
                    ? (projectTasks.filter(t => t.status === "completed").length / projectTasks.length) * 100 
                    : 0;
                  
                  return (
                    <Draggable
                      key={project.id}
                      draggableId={project.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ProjectCard 
                            {...project}
                            progress={progress}
                            tasks={projectTasks}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </td>
  );
};