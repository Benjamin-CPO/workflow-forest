import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskStatusSelectProps {
  status: string;
  onStatusChange: (value: string) => void;
  className?: string;  // Added className as an optional prop
}

export const TaskStatusSelect = ({ status, onStatusChange, className }: TaskStatusSelectProps) => {
  return (
    <Select defaultValue={status} onValueChange={onStatusChange}>
      <SelectTrigger className={`w-[180px] ${className || ''}`}>
        <SelectValue>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2 py-1 rounded ${
              status === "pending" ? "bg-gray-100 text-gray-700" :
              status === "need-revision" ? "bg-red-100 text-red-700" :
              status === "in-progress" ? "bg-blue-100 text-blue-700" :
              status === "in-review" ? "bg-yellow-100 text-yellow-700" :
              "bg-green-100 text-green-700"
            }`}>
              {status}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="in-progress">In Progress</SelectItem>
        <SelectItem value="in-review">In Review</SelectItem>
        <SelectItem value="need-revision">Need Revision</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
};