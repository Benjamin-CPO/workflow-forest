import React from "react";

const Settings = () => {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>
      <div className="grid gap-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Application Settings</h2>
          <p className="text-muted-foreground">Configure your application preferences here.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;