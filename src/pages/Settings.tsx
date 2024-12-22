import { Settings as SettingsIcon } from "lucide-react";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { PermissionsTable } from "@/components/settings/PermissionsTable";

const Settings = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <SettingsSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <div className="flex items-center gap-2 mb-6">
            <SettingsIcon className="h-6 w-6" />
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          </div>
          <PermissionsTable />
        </div>
      </div>
    </div>
  );
};

export default Settings;