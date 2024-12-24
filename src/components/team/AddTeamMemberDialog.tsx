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
import { supabase } from "@/integrations/supabase/client";

const ROLES = ["admin", "manager", "user"] as const;
type Role = typeof ROLES[number];

interface AddTeamMemberDialogProps {
  children: React.ReactNode;
  onMemberAdded: () => void;
}

export function AddTeamMemberDialog({ children, onMemberAdded }: AddTeamMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First, invite the user via email
      const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email);
      
      if (inviteError) throw inviteError;

      // Update the user's role in the profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role })
        .eq('email', email);
      
      if (updateError) throw updateError;
      
      setOpen(false);
      setEmail("");
      setRole("user");
      onMemberAdded();
      toast.success("Team member invited successfully");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to add team member");
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setEmail("");
          setRole("user");
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Team Member</DialogTitle>
            <DialogDescription>
              Invite a new member to your team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter team member email"
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
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Invite Member</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}