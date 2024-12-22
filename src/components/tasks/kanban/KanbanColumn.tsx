import { Droppable, Draggable } from "@hello-pangea/dnd";
import { KanbanCard } from "./KanbanCard";
import { KanbanItem } from "../types/kanban";

interface KanbanColumnProps {
  status: string;
  label: string;
  bgColor: string;
  textColor: string;
  items: KanbanItem[];
  onTaskClick: (task: any) => void;
}

export const KanbanColumn = ({ 
  status, 
  label, 
  bgColor, 
  textColor, 
  items, 
  onTaskClick 
}: KanbanColumnProps) => {
  return (
    <div className={`space-y-4 ${bgColor} rounded-lg p-4`}>
      <div className={`font-semibold text-sm p-2 rounded-lg ${textColor}`}>
        {label}
      </div>
      <Droppable droppableId={status}>
        {(provided) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2 min-h-[100px]"
          >
            {items.map((item, index) => (
              <Draggable 
                key={item.id} 
                draggableId={item.id.toString()} 
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <KanbanCard 
                      item={item}
                      onTaskClick={onTaskClick}
                      isDragging={snapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};