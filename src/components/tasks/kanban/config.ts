import { KanbanColumnConfig } from "./types";

export const columns: KanbanColumnConfig[] = [
  { status: "pending", label: "Pending", bgColor: "bg-gray-100", textColor: "text-gray-700" },
  { status: "in-progress", label: "In Progress", bgColor: "bg-blue-100", textColor: "text-blue-700" },
  { status: "need-revision", label: "Need Revision", bgColor: "bg-red-100", textColor: "text-red-700" },
  { status: "pending-feedback", label: "Pending Feedback", bgColor: "bg-yellow-100", textColor: "text-yellow-700" },
  { status: "completed", label: "Completed", bgColor: "bg-green-100", textColor: "text-green-700" }
];