import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type Role = "admin" | "project_manager" | "designer" | "client";
type Permission = {
  id: string;
  name: string;
  description: string;
};

const roles: Role[] = ["admin", "project_manager", "designer", "client"];

const taskPermissions: Permission[] = [
  { id: "create_task", name: "Create Task", description: "Ability to create new tasks" },
  { id: "edit_task", name: "Edit Task", description: "Ability to edit existing tasks" },
  { id: "delete_task", name: "Delete Task", description: "Ability to delete tasks" },
  { id: "view_task", name: "View Task", description: "Ability to view tasks" },
  { id: "add_subtask", name: "Add Subtask", description: "Ability to add subtasks" },
  { id: "change_status", name: "Change Status", description: "Ability to change task status" },
];

// Initialize default permissions
const initialPermissions = {
  admin: taskPermissions.map(p => p.id),
  project_manager: ["create_task", "edit_task", "view_task", "add_subtask", "change_status"],
  designer: ["view_task", "change_status"],
  client: ["view_task"],
};

export const TaskPermissionsTable = () => {
  const [permissions, setPermissions] = useState<Record<Role, string[]>>(initialPermissions);
  const { toast } = useToast();

  const togglePermission = (role: Role, permissionId: string) => {
    if (role === "admin") {
      toast({
        title: "Cannot modify admin permissions",
        description: "Admin permissions cannot be modified for security reasons.",
        variant: "destructive",
      });
      return;
    }

    setPermissions(prev => {
      const newPermissions = { ...prev };
      if (newPermissions[role].includes(permissionId)) {
        // If removing view_task, show warning toast
        if (permissionId === "view_task") {
          toast({
            title: "Warning",
            description: "Users must have view permission to interact with tasks.",
            variant: "destructive",
          });
          return prev;
        }
        newPermissions[role] = newPermissions[role].filter(id => id !== permissionId);
      } else {
        newPermissions[role] = [...newPermissions[role], permissionId];
      }

      // Store the updated permissions in localStorage
      localStorage.setItem('taskPermissions', JSON.stringify(newPermissions));

      toast({
        title: "Permission Updated",
        description: `Updated ${permissionId} permission for ${role} role`,
      });

      return newPermissions;
    });
  };

  const hasPermission = (role: Role, permissionId: string) => {
    return permissions[role].includes(permissionId);
  };

  const resetPermissions = () => {
    setPermissions(initialPermissions);
    localStorage.setItem('taskPermissions', JSON.stringify(initialPermissions));
    toast({
      title: "Permissions Reset",
      description: "All permissions have been reset to their default values.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={resetPermissions}
          className="mb-4"
        >
          Reset to Defaults
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Permission</TableHead>
              {roles.map(role => (
                <TableHead key={role} className="text-center">
                  {role.replace("_", " ").toUpperCase()}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {taskPermissions.map(permission => (
              <TableRow key={permission.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{permission.name}</div>
                    <div className="text-sm text-muted-foreground">{permission.description}</div>
                  </div>
                </TableCell>
                {roles.map(role => (
                  <TableCell key={`${permission.id}-${role}`} className="text-center">
                    <button
                      onClick={() => togglePermission(role, permission.id)}
                      disabled={role === "admin"}
                      className="mx-auto disabled:opacity-50"
                    >
                      {hasPermission(role, permission.id) ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </button>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};