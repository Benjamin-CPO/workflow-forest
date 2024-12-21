import { Building2 } from "lucide-react";

interface ProjectClientInfoProps {
  clientName: string;
}

export const ProjectClientInfo = ({ clientName }: ProjectClientInfoProps) => {
  return (
    <div className="flex items-center text-sm text-muted-foreground gap-1">
      <Building2 className="h-4 w-4" />
      {clientName}
    </div>
  );
};