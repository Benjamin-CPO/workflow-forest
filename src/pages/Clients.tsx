import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { EditClientDialog } from "@/components/clients/EditClientDialog";
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

export default Clients;