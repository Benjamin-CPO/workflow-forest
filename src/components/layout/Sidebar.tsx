import { List, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { AddProjectDialog } from "@/components/projects/AddProjectDialog";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { useLocation } from "react-router-dom";

const items = [
  {
    title: "All Projects",
    url: "/",
    icon: List,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-4 py-2">
          {location.pathname === "/" && (
            <AddProjectDialog>
              <Button className="w-full justify-start" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </AddProjectDialog>
          )}
          {location.pathname === "/clients" && (
            <AddClientDialog>
              <Button className="w-full justify-start" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Client
              </Button>
            </AddClientDialog>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}