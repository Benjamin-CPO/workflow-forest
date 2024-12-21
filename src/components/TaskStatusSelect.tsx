import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskStatusSelectProps {
  status: string;
  onStatusChange: (value: string) => void;
}

export const TaskStatusSelect = ({ status, onStatusChange }: TaskStatusSelectProps) => {
  return (
    <Select defaultValue={status} onValueChange={onStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          <span className={`inline-flex items-center ${
            status === "pending" ? "text-gray-500" :
            status === "in-progress" ? "text-orange-500" :
            status === "completed" ? "text-green-500" : ""
          }`}>
            {status === "pending" ? "Pending" :
             status === "in-progress" ? "In Progress" :
             status === "completed" ? "Completed" : status}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">
          <span className="text-gray-500">Pending</span>
        </SelectItem>
        <SelectItem value="in-progress">
          <span className="text-orange-500">In Progress</span>
        </SelectItem>
        <SelectItem value="completed">
          <span className="text-green-500">Completed</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};