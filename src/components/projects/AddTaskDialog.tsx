import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Milestone } from "@/types/project";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import { toast } from "sonner";

interface AddTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; dueDate: string; milestoneId: number }) => void;
  milestones: Milestone[];
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dueDate: z.string().min(1, "Due date is required"),
  milestoneId: z.string().min(1, "Milestone is required"),
});

export const AddTaskDialog = ({ isOpen, onOpenChange, onSubmit, milestones }: AddTaskDialogProps) => {
  const { impersonatedUser } = useImpersonation();
  const canCreateTask = !impersonatedUser || ["Admin", "Manager", "Designer"].includes(impersonatedUser.role);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      dueDate: "",
      milestoneId: "",
    },
  });

  const handleSubmit = (data: { title: string; dueDate: string; milestoneId: string }) => {
    if (!canCreateTask) {
      toast.error("You don't have permission to create tasks");
      return;
    }

    onSubmit({
      title: data.title,
      dueDate: data.dueDate,
      milestoneId: parseInt(data.milestoneId),
    });
    form.reset();
    onOpenChange(false);
  };

  if (!canCreateTask) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="milestoneId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Milestone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a milestone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {milestones.map((milestone) => (
                        <SelectItem key={milestone.id} value={milestone.id.toString()}>
                          {milestone.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Add Task
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};