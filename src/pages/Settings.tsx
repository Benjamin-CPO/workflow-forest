import React from "react";
import { TaskPermissionsTable } from "@/components/settings/TaskPermissionsTable";

const Settings = () => {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>
      <div className="grid gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Task Permissions</h2>
          <p className="text-muted-foreground mb-6">Configure role-based permissions for task management.</p>
          <TaskPermissionsTable />
        </div>
      </div>
    </div>
  );
};

export default Settings;