import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const roles = ["Client", "Admin", "Product Manager", "Designer"] as const;
type Role = typeof roles[number];

const actions = [
  "View Projects",
  "Create Projects",
  "Edit Projects",
  "Delete Projects",
  "View Tasks",
  "Create Tasks",
  "Edit Tasks",
  "Delete Tasks",
  "View Team Members",
  "Add Team Members",
  "Edit Team Members",
  "Delete Team Members",
  "View Clients",
  "Add Clients",
  "Edit Clients",
  "Delete Clients",
  "Access Settings",
  "Manage Permissions",
] as const;
type Action = typeof actions[number];

type Permissions = {
  [key in Action]: {
    [key in Role]: boolean;
  };
};

const defaultPermissions: Permissions = {
  "View Projects": {
    Client: true,
    Admin: true,
    "Product Manager": true,
    Designer: true,
  },
  "Create Projects": {
    Client: false,
    Admin: true,
    "Product Manager": true,
    Designer: false,
  },
  // ... Initialize other permissions with reasonable defaults
  "Access Settings": {
    Client: false,
    Admin: true,
    "Product Manager": false,
    Designer: false,
  },
  "Manage Permissions": {
    Client: false,
    Admin: true,
    "Product Manager": false,
    Designer: false,
  },
} as Permissions;

// Initialize remaining permissions to false
actions.forEach((action) => {
  if (!defaultPermissions[action]) {
    defaultPermissions[action] = {
      Client: false,
      Admin: true,
      "Product Manager": false,
      Designer: false,
    };
  }
});

export function PermissionsTable() {
  const [permissions, setPermissions] = useState<Permissions>(defaultPermissions);

  const handleToggle = (action: Action, role: Role) => {
    setPermissions((prev) => ({
      ...prev,
      [action]: {
        ...prev[action],
        [role]: !prev[action][role],
      },
    }));
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Action</TableHead>
            {roles.map((role) => (
              <TableHead key={role} className="text-center">
                {role}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {actions.map((action) => (
            <TableRow key={action}>
              <TableCell className="font-medium">{action}</TableCell>
              {roles.map((role) => (
                <TableCell key={role} className="text-center">
                  <Switch
                    checked={permissions[action][role]}
                    onCheckedChange={() => handleToggle(action, role)}
                    className="mx-auto"
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}