import { Card, CardContent } from "@/components/ui/card";
import { KanbanItem, isSubtaskWithParent } from "../types/kanban";

interface KanbanCardProps {
  item: KanbanItem;
  onTaskClick?: (task: any) => void;
  isDragging?: boolean;
}

export const KanbanCard = ({ item, onTaskClick, isDragging }: KanbanCardProps) => {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow bg-white ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => !isSubtaskWithParent(item) && onTaskClick?.(item)}
    >
      <CardContent className="p-3 space-y-2">
        <div className="font-medium text-sm">{item.title}</div>
        {isSubtaskWithParent(item) ? (
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              {item.milestoneTitle}
            </div>
            <div className="text-xs text-muted-foreground">
              Task: {item.parentTaskTitle}
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            {item.milestoneTitle}
          </div>
        )}
      </CardContent>
    </Card>
  );
};