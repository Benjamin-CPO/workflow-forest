import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppBar } from "@/components/layout/AppBar";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";

const queryClient = new QueryClient();

const Clients = () => (
  <div className="container py-6">
    <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
    <p className="text-muted-foreground">Manage your client relationships</p>
  </div>
);

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