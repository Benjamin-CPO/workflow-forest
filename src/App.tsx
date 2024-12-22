import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppBar } from "@/components/layout/AppBar";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { EditClientDialog } from "@/components/clients/EditClientDialog";
import { AddTeamMemberDialog } from "@/components/team/AddTeamMemberDialog";
import { EditTeamMemberDialog } from "@/components/team/EditTeamMemberDialog";
import Settings from "./pages/Settings";
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

const queryClient = new QueryClient();

const Team = () => {
  const [members, setMembers] = React.useState<Array<{ id: number; name: string; role: string }>>([]);

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

  return (
    <div className="container py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team</h1>
            <p className="text-muted-foreground">Manage your team members</p>
          </div>
          <AddTeamMemberDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Team Member
            </Button>
          </AddTeamMemberDialog>
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

const Clients = () => {
  const [clients, setClients] = React.useState<Array<{ id: number; name: string }>>([]);

  const loadClients = () => {
    const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    setClients(storedClients);
  };

  React.useEffect(() => {
    loadClients();
  }, []);

  const handleDeleteClient = (clientId: number) => {
    const updatedClients = clients.filter(client => client.id !== clientId);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
    setClients(updatedClients);
    toast.success("Client deleted successfully");
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
            <p className="text-muted-foreground">Manage your client relationships</p>
          </div>
          <AddClientDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Client
            </Button>
          </AddClientDialog>
        </div>
      </div>
      <div className="grid gap-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <span className="font-medium">{client.name}</span>
            <div className="flex items-center gap-2">
              <EditClientDialog client={client} onClientUpdated={loadClients} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Client</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {client.name}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteClient(client.id)}>
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col w-full">
          <AppBar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/team" element={<Team />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;