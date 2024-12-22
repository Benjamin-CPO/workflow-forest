import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Milestone } from "@/types/project";

export const useMilestoneManagement = (
  milestones: Milestone[],
  setMilestones: (milestones: Milestone[]) => void
) => {
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const { toast } = useToast();

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a milestone title.",
        variant: "destructive",
      });
      return;
    }

    const newMilestone: Milestone = {
      id: Math.max(0, ...milestones.map(m => m.id)) + 1,
      title: newMilestoneTitle,
      tasks: [],
    };

    setMilestones([...milestones, newMilestone]);
    setNewMilestoneTitle("");
    setIsMilestoneDialogOpen(false);
    toast({
      title: "Milestone added",
      description: "New milestone has been added successfully.",
    });
  };

  return {
    isMilestoneDialogOpen,
    setIsMilestoneDialogOpen,
    newMilestoneTitle,
    setNewMilestoneTitle,
    handleAddMilestone,
  };
};