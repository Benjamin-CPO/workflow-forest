import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskStatusSelectProps {
  status: string;
  onStatusChange: (value: string) => void;
  className?: string;  // Added className as an optional prop
}

export const TaskStatusSelect = ({ status, onStatusChange, className }: TaskStatusSelectProps) => {
  const getStatusStyles = (currentStatus: string) => {
    switch(currentStatus) {
      case "pending":
        return "bg-gray-100 text-gray-700";
      case "need-revision":
        return "bg-red-100 text-red-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "in-review":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Select defaultValue={status} onValueChange={onStatusChange}>
      <SelectTrigger className={`w-[180px] ${className || ''}`}>
        <SelectValue>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2 py-1 rounded ${getStatusStyles(status)}`}>
              {status}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">
          <span className={`inline-flex items-center px-2 py-1 rounded ${getStatusStyles("pending")}`}>
            Pending
          </span>
        </SelectItem>
        <SelectItem value="in-progress">
          <span className={`inline-flex items-center px-2 py-1 rounded ${getStatusStyles("in-progress")}`}>
            In Progress
          </span>
        </SelectItem>
        <SelectItem value="in-review">
          <span className={`inline-flex items-center px-2 py-1 rounded ${getStatusStyles("in-review")}`}>
            In Review
          </span>
        </SelectItem>
        <SelectItem value="need-revision">
          <span className={`inline-flex items-center px-2 py-1 rounded ${getStatusStyles("need-revision")}`}>
            Need Revision
          </span>
        </SelectItem>
        <SelectItem value="completed">
          <span className={`inline-flex items-center px-2 py-1 rounded ${getStatusStyles("completed")}`}>
            Completed
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};