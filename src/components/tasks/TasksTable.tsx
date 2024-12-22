import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { TaskStatusSelect } from "@/components/TaskStatusSelect";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

interface SubTask {
  id: number;
  title: string;
  status: string;
}

interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  subtasks?: SubTask[];
}

interface TasksTableProps {
  tasks: Task[];
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onAddSubtask?: (taskId: number, subtask: { title: string; status: string }) => void;
  onDeleteSubtask?: (taskId: number, subtaskId: number) => void;
  onSubtaskStatusChange?: (taskId: number, subtaskId: number, newStatus: string) => void;
}

export const TasksTable = ({ 
  tasks, 
  onStatusChange, 
  onTaskClick, 
  onDeleteTask,
  onAddSubtask,
  onDeleteSubtask,
  onSubtaskStatusChange
}: TasksTableProps) => {
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Due Date</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <>
            <TableRow 
              key={task.id}
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => toggleTaskExpansion(task.id)}
                >
                  {expandedTasks.has(task.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                <span onClick={() => onTaskClick(task)}>{task.title}</span>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <TaskStatusSelect
                  status={task.status}
                  onStatusChange={(value) => onStatusChange(task.id, value)}
                />
              </TableCell>
              <TableCell>{task.dueDate}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDeleteTask) {
                      onDeleteTask(task.id);
                      toast({
                        title: "Success",
                        description: "Task deleted successfully",
                      });
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            {expandedTasks.has(task.id) && (
              <>
                {task.subtasks?.map((subtask) => (
                  <TableRow key={subtask.id} className="bg-muted/30">
                    <TableCell className="pl-10">{subtask.title}</TableCell>
                    <TableCell>
                      <TaskStatusSelect
                        status={subtask.status}
                        onStatusChange={(value) => 
                          onSubtaskStatusChange?.(task.id, subtask.id, value)
                        }
                      />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          onDeleteSubtask?.(task.id, subtask.id);
                          toast({
                            title: "Success",
                            description: "Subtask deleted successfully",
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/30">
                  <TableCell className="pl-10">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="New subtask title"
                        value={newSubtaskTitles[task.id] || ""}
                        onChange={(e) => 
                          setNewSubtaskTitles(prev => ({
                            ...prev,
                            [task.id]: e.target.value
                          }))
                        }
                        className="h-8"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddSubtask(task.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </>
            )}
          </>
        ))}
      </TableBody>
    </Table>
  );
};