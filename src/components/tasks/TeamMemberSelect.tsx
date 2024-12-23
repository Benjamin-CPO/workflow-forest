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

interface TeamMemberSelectProps {
  value?: number;
  onValueChange: (value: number | undefined) => void;
  className?: string;
}

export const TeamMemberSelect = ({ value, onValueChange, className }: TeamMemberSelectProps) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const storedTeamMembers = JSON.parse(localStorage.getItem('team-members') || '[]');
    setTeamMembers(storedTeamMembers);
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
    <Select
      value={value?.toString()}
      onValueChange={(val) => onValueChange(val === 'unassigned' ? undefined : Number(val))}
      className={className}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Unassigned">
          {selectedMember && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>{getInitials(selectedMember.name)}</AvatarFallback>
              </Avatar>
              <span>{selectedMember.name}</span>
            </div>
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
  );
};