import { Table, TableBody } from "@/components/ui/table";
import { Task } from "@/types/project";
import { TaskTableHeader } from "./table/TableHeader";
import { TaskTableRow } from "./table/TaskTableRow";
import { AddTaskButton } from "./table/AddTaskButton";

interface TasksTableProps {
  tasks: Task[];
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onAddSubtask?: (taskId: number, subtask: { id: number; title: string; status: string }) => void;
  onDeleteSubtask?: (taskId: number, subtaskId: number) => void;
  onSubtaskStatusChange?: (taskId: number, subtaskId: number, newStatus: string) => void;
  onAddTask?: () => void;
}

export const TasksTable = ({
  tasks,
  onStatusChange,
  onTaskClick,
  onDeleteTask,
  onAddSubtask,
  onDeleteSubtask,
  onSubtaskStatusChange,
  onAddTask
}: TasksTableProps) => {
  return (
    <div className="w-full border rounded-md">
      <Table>
        <TaskTableHeader />
        <TableBody>
          {tasks.map((task) => (
            <TaskTableRow
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onTaskClick={onTaskClick}
              onDeleteTask={onDeleteTask}
              onAddSubtask={onAddSubtask}
              onDeleteSubtask={onDeleteSubtask}
              onSubtaskStatusChange={onSubtaskStatusChange}
            />
          ))}
          <AddTaskButton onAddTask={onAddTask} />
        </TableBody>
      </Table>
    </div>
  );
};