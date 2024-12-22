import { Table, TableBody } from "@/components/ui/table";
import { TaskTableProps } from "./types/table";
import { TaskTableHeader } from "./table/TableHeader";
import { TaskList } from "./table/TaskList";
import { AddTaskButton } from "./table/AddTaskButton";

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
  return (
    <Table>
      <TaskTableHeader />
      <TableBody>
        <TaskList
          tasks={tasks}
          onStatusChange={onStatusChange}
          onTaskClick={onTaskClick}
          onDeleteTask={onDeleteTask}
          onAddSubtask={onAddSubtask}
          onDeleteSubtask={onDeleteSubtask}
          onSubtaskStatusChange={onSubtaskStatusChange}
        />
        <AddTaskButton onAddTask={onAddTask} />
      </TableBody>
    </Table>
  );
};