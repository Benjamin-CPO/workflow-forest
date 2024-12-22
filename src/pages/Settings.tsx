import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Permissions from "./settings/Permissions";

const settingsNavItems = [
  {
    title: "Permissions",
    path: "/settings/permissions",
    icon: Shield,
  },
];

const Settings = () => {
  const location = useLocation();

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>
      
      <div className="flex">
        <Sidebar className="w-64 border-r">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {settingsNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.path}
                      >
                        <Link to={item.path}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1">
          <Routes>
            <Route path="/permissions" element={<Permissions />} />
            <Route
              path="/"
              element={
                <div className="p-6 text-muted-foreground">
                  Select a settings category from the sidebar
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Settings;