import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTeamMemberDialog } from "@/components/team/AddTeamMemberDialog";
import { EditTeamMemberDialog } from "@/components/team/EditTeamMemberDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TeamMember {
  id: string;
  name: string | null;
  role: string;
}

const Team = () => {
  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [userRole, setUserRole] = React.useState<string | null>(null);

  const loadMembers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, name, role');
      
      if (error) throw error;
      
      setMembers(profiles || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to load team members");
    }
  };

  const getCurrentUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        setUserRole(profile?.role || null);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to get user role");
    }
  };

  React.useEffect(() => {
    loadMembers();
    getCurrentUserRole();
  }, []);

  const handleDeleteMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'user' })
        .eq('id', memberId);

      if (error) throw error;

      toast.success("Team member removed successfully");
      loadMembers();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to remove team member");
    }
  };

  // Only admin and manager can see the add member button
  const canManageTeam = userRole === 'admin' || userRole === 'manager';

  return (
    <div className="container py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team</h1>
            <p className="text-muted-foreground">Manage your team members</p>
          </div>
          {canManageTeam && (
            <AddTeamMemberDialog onMemberAdded={loadMembers}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Team Member
              </Button>
            </AddTeamMemberDialog>
          )}
        </div>
      </div>
      <div className="grid gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <span className="font-medium">{member.name || 'Unnamed Member'}</span>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
            {canManageTeam && (
              <div className="flex items-center gap-2">
                <EditTeamMemberDialog member={member} onMemberUpdated={loadMembers} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {member.name || 'this member'} from the team? This will reset their role to 'user'.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteMember(member.id)}>
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;