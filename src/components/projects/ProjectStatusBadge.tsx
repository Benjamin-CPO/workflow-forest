import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProjectStatusBadgeProps {
  status: 'priority' | null;
}

export const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
  if (status !== 'priority') return null;
  
  return (
    <Badge className="bg-[#F97316] hover:bg-[#F97316]/80 gap-1">
      <Star className="h-3 w-3" />
      Priority Project
    </Badge>
  );
};