import React from "react";
import { Route, Routes } from "react-router-dom";

const Permissions = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Permissions</h2>
    <p className="text-muted-foreground">Manage user permissions and roles</p>
  </div>
);

const Settings = () => {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>
      <Routes>
        <Route path="/permissions" element={<Permissions />} />
        <Route
          index
          element={<div className="p-6">Select a settings page</div>}
        />
      </Routes>
    </div>
  );
};

export default Settings;