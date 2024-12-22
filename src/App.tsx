import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppBar } from "@/components/layout/AppBar";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import { SidebarProvider } from "@/components/ui/sidebar";

const queryClient = new QueryClient();

function App() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <TooltipProvider>
              <AppBar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/project/:id" element={<ProjectDetails />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/settings/*" element={<Settings />} />
                </Routes>
              </div>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </div>
    </SidebarProvider>
  );
}

export default App;