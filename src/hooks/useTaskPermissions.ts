import { useImpersonation } from "@/contexts/ImpersonationContext";

// Default permissions configuration matching TaskPermissionsTable
const defaultPermissions = {
  admin: ["create_task", "edit_task", "delete_task", "view_task", "add_subtask", "change_status"],
  project_manager: ["create_task", "edit_task", "view_task", "add_subtask", "change_status"],
  designer: ["view_task", "change_status"],
  client: ["view_task"],
};

type Permission = "create_task" | "edit_task" | "delete_task" | "view_task" | "add_subtask" | "change_status";

export const useTaskPermissions = () => {
  const { impersonatedUser } = useImpersonation();

  const hasPermission = (permission: Permission): boolean => {
    if (!impersonatedUser) return true; // If not impersonating, allow all actions
    const role = impersonatedUser.role.toLowerCase() as keyof typeof defaultPermissions;
    return defaultPermissions[role]?.includes(permission) ?? false;
  };

  return { hasPermission };
};