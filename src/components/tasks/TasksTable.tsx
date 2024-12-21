import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { TaskStatusSelect } from "@/components/TaskStatusSelect";

interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
}

interface TasksTableProps {
  tasks: Task[];
  onStatusChange: (taskId: number, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
}

export const TasksTable = ({ tasks, onStatusChange, onTaskClick }: TasksTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Due Date</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow 
            key={task.id} 
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onTaskClick(task)}
          >
            <TableCell>{task.title}</TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <TaskStatusSelect
                status={task.status}
                onStatusChange={(value) => onStatusChange(task.id, value)}
              />
            </TableCell>
            <TableCell>{task.dueDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};