import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddMilestoneDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  milestoneTitle: string;
  setMilestoneTitle: (title: string) => void;
  onAddMilestone: () => void;
}

export const AddMilestoneDialog = ({
  isOpen,
  onOpenChange,
  milestoneTitle,
  setMilestoneTitle,
  onAddMilestone,
}: AddMilestoneDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Milestone</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Enter milestone title"
            value={milestoneTitle}
            onChange={(e) => setMilestoneTitle(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddMilestone}>Add Milestone</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};