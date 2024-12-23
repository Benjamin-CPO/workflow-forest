import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamMember } from "@/types/project";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TeamMemberSelectProps {
  value?: number;
  onValueChange: (value: number | undefined) => void;
  className?: string;
}

export const TeamMemberSelect = ({ value, onValueChange, className }: TeamMemberSelectProps) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const storedTeamMembers = localStorage.getItem('team-members');
    if (storedTeamMembers) {
      try {
        const parsedMembers = JSON.parse(storedTeamMembers);
        setTeamMembers(Array.isArray(parsedMembers) ? parsedMembers : []);
      } catch (error) {
        console.error('Error parsing team members:', error);
        setTeamMembers([]);
      }
    }
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const selectedMember = teamMembers.find(member => member.id === value);

  return (
    <div className={cn("w-[200px]", className)}>
      <Select
        value={value?.toString() || "unassigned"}
        onValueChange={(val) => onValueChange(val === 'unassigned' ? undefined : Number(val))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Unassigned">
            {selectedMember ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{getInitials(selectedMember.name)}</AvatarFallback>
                </Avatar>
                <span>{selectedMember.name}</span>
              </div>
            ) : (
              "Unassigned"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unassigned">Unassigned</SelectItem>
          {teamMembers.map((member) => (
            <SelectItem key={member.id} value={member.id.toString()}>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <span>{member.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};