import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

// Default permissions configuration
const defaultPermissions = {
  admin: taskPermissions.map(p => p.id),
  project_manager: ["create_task", "edit_task", "view_task", "add_subtask", "change_status"],
  designer: ["view_task", "change_status"],
  client: ["view_task"],
};

export const TaskPermissionsTable = () => {
  const [permissions, setPermissions] = useState<Record<Role, string[]>>(defaultPermissions);
  const { toast } = useToast();

  const togglePermission = (role: Role, permissionId: string) => {
    setPermissions(prev => {
      const newPermissions = { ...prev };
      if (role === "admin") {
        // Admin always has all permissions
        return prev;
      }

      if (newPermissions[role].includes(permissionId)) {
        newPermissions[role] = newPermissions[role].filter(id => id !== permissionId);
      } else {
        newPermissions[role] = [...newPermissions[role], permissionId];
      }

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

  return (
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
  );
};