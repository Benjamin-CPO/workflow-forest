import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const Settings = () => {
  // Define roles and permissions
  const roles = ["Admin", "Manager", "Team Member", "Client"];
  const permissions = [
    {
      category: "Projects",
      actions: ["View", "Create", "Edit", "Delete"],
    },
    {
      category: "Tasks",
      actions: ["View", "Create", "Edit", "Delete", "Change Status"],
    },
    {
      category: "Team Members",
      actions: ["View", "Add", "Edit", "Remove"],
    },
    {
      category: "Clients",
      actions: ["View", "Add", "Edit", "Remove"],
    },
    {
      category: "Settings",
      actions: ["View", "Modify"],
    },
  ];

  // State to manage permissions
  const [permissionMatrix, setPermissionMatrix] = React.useState<Record<string, Record<string, boolean>>>({});

  // Initialize permission matrix
  React.useEffect(() => {
    const storedMatrix = localStorage.getItem('permissionMatrix');
    if (storedMatrix) {
      setPermissionMatrix(JSON.parse(storedMatrix));
    } else {
      const initialMatrix: Record<string, Record<string, boolean>> = {};
      permissions.forEach(({ category, actions }) => {
        actions.forEach(action => {
          const key = `${category}-${action}`;
          initialMatrix[key] = {
            Admin: true,
            Manager: action !== "Delete" && action !== "Remove",
            "Team Member": action === "View" || action === "Create",
            Client: action === "View",
          };
        });
      });
      setPermissionMatrix(initialMatrix);
      localStorage.setItem('permissionMatrix', JSON.stringify(initialMatrix));
    }
  }, []);

  const handlePermissionChange = (category: string, action: string, role: string) => {
    const key = `${category}-${action}`;
    setPermissionMatrix(prev => {
      const updated = {
        ...prev,
        [key]: {
          ...prev[key],
          [role]: !prev[key]?.[role]
        }
      };
      localStorage.setItem('permissionMatrix', JSON.stringify(updated));
      return updated;
    });
    toast.success(`Permission updated for ${role}`);
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage permissions and access controls</p>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Feature / Action</TableHead>
              {roles.map((role) => (
                <TableHead key={role} className="text-center">{role}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map(({ category, actions }) => (
              <React.Fragment key={category}>
                {actions.map((action, actionIndex) => (
                  <TableRow key={`${category}-${action}`}>
                    <TableCell className="font-medium">
                      {actionIndex === 0 ? (
                        <div className="font-bold text-muted-foreground mb-2">{category}</div>
                      ) : null}
                      {action}
                    </TableCell>
                    {roles.map((role) => (
                      <TableCell key={role} className="text-center">
                        <div className="flex items-center justify-center">
                          <Checkbox
                            checked={permissionMatrix[`${category}-${action}`]?.[role] ?? false}
                            onCheckedChange={() => handlePermissionChange(category, action, role)}
                            disabled={role === "Admin"} // Admin always has all permissions
                          />
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Settings;