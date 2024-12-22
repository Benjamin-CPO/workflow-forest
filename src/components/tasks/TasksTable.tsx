import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TaskRow } from "./table/TaskRow";
import { SubtaskRow } from "./table/SubtaskRow";
import { NewSubtaskRow } from "./table/NewSubtaskRow";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskTableProps } from "./types/table";

export const TasksTable = ({ 
  tasks, 
  onStatusChange, 
  onTaskClick, 
  onDeleteTask,
  onAddSubtask,
  onDeleteSubtask,
  onSubtaskStatusChange,
  onAddTask
}: TaskTableProps) => {
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [newSubtaskTitles, setNewSubtaskTitles] = useState<{ [key: number]: string }>({});
  const { toast } = useToast();

  const toggleTaskExpansion = (taskId: number) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const handleAddSubtask = (taskId: number) => {
    if (!newSubtaskTitles[taskId]?.trim()) {
      toast({
        title: "Error",
        description: "Subtask title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    onAddSubtask?.(taskId, {
      title: newSubtaskTitles[taskId],
      status: "pending"
    });

    setNewSubtaskTitles(prev => ({
      ...prev,
      [taskId]: ""
    }));

    toast({
      title: "Success",
      description: "Subtask added successfully",
    });
  };

  const handleNewSubtaskTitleChange = (taskId: number, title: string) => {
    setNewSubtaskTitles(prev => ({
      ...prev,
      [taskId]: title
    }));
  };

  const handleDeleteSubtask = (taskId: number, subtaskId: number) => {
    onDeleteSubtask?.(taskId, subtaskId);
    toast({
      title: "Success",
      description: "Subtask deleted successfully",
    });
  };

  const handleAddTask = () => {
    if (onAddTask) {
      onAddTask();
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell className="text-left w-[300px]">Title</TableCell>
          <TableCell className="text-left w-[200px]">Status</TableCell>
          <TableCell className="text-left w-[150px]">Due Date</TableCell>
          <TableCell className="text-right w-[100px]">Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleAddTask}
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </TableCell>
          </TableRow>
        ) : (
          <>
            {tasks.map((task) => (
              <React.Fragment key={task.id}>
                <TaskRow
                  task={task}
                  isExpanded={expandedTasks.has(task.id)}
                  onToggleExpand={toggleTaskExpansion}
                  onStatusChange={onStatusChange}
                  onTaskClick={onTaskClick}
                  onDeleteTask={onDeleteTask}
                />
                {expandedTasks.has(task.id) && task.subtasks?.map((subtask) => (
                  <SubtaskRow
                    key={subtask.id}
                    subtask={subtask}
                    taskId={task.id}
                    onStatusChange={onSubtaskStatusChange!}
                    onDelete={handleDeleteSubtask}
                  />
                ))}
                {expandedTasks.has(task.id) && (
                  <NewSubtaskRow
                    taskId={task.id}
                    newSubtaskTitle={newSubtaskTitles[task.id] || ""}
                    onNewSubtaskTitleChange={handleNewSubtaskTitleChange}
                    onAddSubtask={handleAddSubtask}
                  />
                )}
              </React.Fragment>
            ))}
            <TableRow>
              <TableCell colSpan={4}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleAddTask}
                >
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </TableCell>
            </TableRow>
          </>
        )}
      </TableBody>
    </Table>
  );
};