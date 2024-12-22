import { Client, Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { Droppable, Draggable } from '@hello-pangea/dnd';

interface ProjectColumnProps {
  client: Client;
  projects: Project[];
  onDeleteProject: (projectId: number) => void;
}

export const ProjectColumn = ({ client, projects, onDeleteProject }: ProjectColumnProps) => {
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
                .map((project, index) => (
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
                          onDelete={() => onDeleteProject(project.id)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </td>
  );
};