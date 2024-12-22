import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskStatusSelectProps {
  status: string;
  onStatusChange: (value: string) => void;
}

export const TaskStatusSelect = ({ status, onStatusChange }: TaskStatusSelectProps) => {
  return (
    <Select defaultValue={status} onValueChange={onStatusChange}>
      <SelectTrigger className="w-[180px] justify-end">
        <SelectValue>
          <div className="flex justify-end w-full">
            <span className={`inline-flex items-center px-2 py-1 rounded ${
              status === "pending" ? "bg-gray-100 text-gray-700" :
              status === "need-revision" ? "bg-red-100 text-red-700" :
              status === "in-progress" ? "bg-orange-100 text-orange-700" :
              status === "need-feedback" ? "bg-blue-100 text-blue-700" :
              status === "completed" ? "bg-green-100 text-green-700" : ""
            }`}>
              {status === "pending" ? "Pending" :
               status === "need-revision" ? "Need Revision" :
               status === "in-progress" ? "In Progress" :
               status === "need-feedback" ? "Need Feedback" :
               status === "completed" ? "Completed" : status}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Pending</span>
        </SelectItem>
        <SelectItem value="need-revision">
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded">Need Revision</span>
        </SelectItem>
        <SelectItem value="in-progress">
          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">In Progress</span>
        </SelectItem>
        <SelectItem value="need-feedback">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Need Feedback</span>
        </SelectItem>
        <SelectItem value="completed">
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Completed</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};