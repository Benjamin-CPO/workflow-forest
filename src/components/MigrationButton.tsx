import { Button } from "@/components/ui/button";
import { migrateDataToSupabase } from "@/utils/migrationUtils";
import { toast } from "sonner";

export const MigrationButton = () => {
  const handleMigration = async () => {
    const { success, error } = await migrateDataToSupabase();
    
    if (success) {
      toast.success("Data successfully migrated to Supabase!");
    } else {
      toast.error("Failed to migrate data: " + (error?.message || "Unknown error"));
    }
  };

  return (
    <Button onClick={handleMigration} className="w-full">
      Migrate Data to Supabase
    </Button>
  );
};