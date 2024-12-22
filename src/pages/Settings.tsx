import React from "react";
import { Settings as SettingsIcon, Shield } from "lucide-react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Permissions",
    url: "/settings/permissions",
    icon: Shield,
  },
];

const Permissions = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Permissions</h2>
    <p className="text-muted-foreground">Manage user permissions and roles</p>
  </div>
);

const Settings = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={`flex items-center space-x-2 ${
                        location.pathname === item.url
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/permissions" element={<Permissions />} />
            <Route
              index
              element={<div className="p-6">Select a settings page</div>}
            />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;