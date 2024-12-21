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
          <span className={`inline-flex items-center px-2 py-1 rounded ${
            status === "pending" ? "bg-gray-100 text-gray-700" :
            status === "in-progress" ? "bg-orange-100 text-orange-700" :
            status === "completed" ? "bg-green-100 text-green-700" : ""
          }`}>
            {status === "pending" ? "Pending" :
             status === "in-progress" ? "In Progress" :
             status === "completed" ? "Completed" : status}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Pending</span>
        </SelectItem>
        <SelectItem value="in-progress">
          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">In Progress</span>
        </SelectItem>
        <SelectItem value="completed">
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Completed</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};