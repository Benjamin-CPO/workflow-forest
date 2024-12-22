import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

const ROLES = ["admin", "project_manager", "designer", "client"] as const;
type Role = typeof ROLES[number];

interface EditTeamMemberDialogProps {
  member: {
    id: number;
    name: string;
    role: string;
  };
  onMemberUpdated: () => void;
}

export function EditTeamMemberDialog({ member, onMemberUpdated }: EditTeamMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState<Role>(member.role as Role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
    const updatedMembers = teamMembers.map((m: typeof member) => 
      m.id === member.id ? { ...m, name, role } : m
    );
    
    localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
    
    setOpen(false);
    onMemberUpdated();
    toast.success("Team member updated successfully");
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setName(member.name);
          setRole(member.role as Role);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update team member information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter team member name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value: Role) => setRole(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.replace('_', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}