import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

const AppBar = () => {
  const [impersonatedUser, setImpersonatedUser] = React.useState<{ name: string; role: string } | null>(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('impersonatedUser');
    if (storedUser) {
      setImpersonatedUser(JSON.parse(storedUser));
    }
  }, []);

  const handleStopImpersonation = () => {
    localStorage.removeItem('impersonatedUser');
    setImpersonatedUser(null);
    toast.success("Stopped impersonation");
    window.location.reload(); // Reload to reset all permissions
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="font-bold">
            Project Manager
          </a>
        </div>
        <div className="flex items-center gap-4">
          {impersonatedUser && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStopImpersonation}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Leave {impersonatedUser.name}'s View
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppBar;