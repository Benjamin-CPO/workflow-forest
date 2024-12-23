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

  const getStoredPermissions = () => {
    try {
      const storedPermissions = localStorage.getItem('taskPermissions');
      if (!storedPermissions) {
        localStorage.setItem('taskPermissions', JSON.stringify(defaultPermissions));
        return defaultPermissions;
      }
      const parsedPermissions = JSON.parse(storedPermissions);
      // Validate the structure
      if (typeof parsedPermissions === 'object' && Object.keys(parsedPermissions).length > 0) {
        return parsedPermissions;
      }
      return defaultPermissions;
    } catch (error) {
      console.error('Error reading permissions:', error);
      return defaultPermissions;
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!impersonatedUser) return true; // If not impersonating, allow all actions
    
    const role = impersonatedUser.role.toLowerCase() as keyof typeof defaultPermissions;
    const currentPermissions = getStoredPermissions();
    
    return currentPermissions[role]?.includes(permission) ?? false;
  };

  return { hasPermission };
};