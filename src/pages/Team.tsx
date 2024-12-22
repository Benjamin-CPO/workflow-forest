import React from "react";
import { Plus, Trash2, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTeamMemberDialog } from "@/components/team/AddTeamMemberDialog";
import { EditTeamMemberDialog } from "@/components/team/EditTeamMemberDialog";
import { toast } from "sonner";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Team = () => {
  const [members, setMembers] = React.useState<Array<{ id: number; name: string; role: string }>>([]);
  const [impersonatedUser, setImpersonatedUser] = React.useState<{ id: number; name: string; role: string } | null>(null);

  const loadMembers = () => {
    const storedMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
    setMembers(storedMembers);
  };

  React.useEffect(() => {
    loadMembers();
  }, []);

  const handleDeleteMember = (memberId: number) => {
    const updatedMembers = members.filter(member => member.id !== memberId);
    localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
    setMembers(updatedMembers);
    toast.success("Team member deleted successfully");
  };

  const handleImpersonateUser = (member: { id: number; name: string; role: string }) => {
    setImpersonatedUser(member);
    localStorage.setItem('impersonatedUser', JSON.stringify(member));
    toast.success(`Now viewing as ${member.name} (${member.role})`);
  };

  const stopImpersonation = () => {
    setImpersonatedUser(null);
    localStorage.removeItem('impersonatedUser');
    toast.success("Stopped impersonation");
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team</h1>
            <p className="text-muted-foreground">Manage your team members</p>
          </div>
          <div className="flex gap-2">
            {impersonatedUser && (
              <Button variant="outline" onClick={stopImpersonation}>
                Stop viewing as {impersonatedUser.name}
              </Button>
            )}
            <AddTeamMemberDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Team Member
              </Button>
            </AddTeamMemberDialog>
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <span className="font-medium">{member.name}</span>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <UserCog className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleImpersonateUser(member)}>
                    View as {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <EditTeamMemberDialog member={member} onMemberUpdated={loadMembers} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {member.name}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteMember(member.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;