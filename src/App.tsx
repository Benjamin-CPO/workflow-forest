import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppBar } from "@/components/layout/AppBar";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddClientDialog } from "@/components/clients/AddClientDialog";

const queryClient = new QueryClient();

const Clients = () => {
  const clients = JSON.parse(localStorage.getItem('clients') || '[]');

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
        {clients.map((client: { id: number; name: string }) => (
          <div
            key={client.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <span className="font-medium">{client.name}</span>
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
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;