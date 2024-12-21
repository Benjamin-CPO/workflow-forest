import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { TaskStatusSelect } from "@/components/TaskStatusSelect";

interface TaskEditDialogProps {
  task: {
    id: number;
    title: string;
    status: string;
    dueDate: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: number, data: { title: string; status: string; dueDate: string }) => void;
}

export const TaskEditDialog = ({ task, isOpen, onClose, onSave }: TaskEditDialogProps) => {
  const form = useForm({
    defaultValues: {
      title: task?.title || "",
      status: task?.status || "pending",
      dueDate: task?.dueDate || "",
    },
  });

  const handleSubmit = (data: { title: string; status: string; dueDate: string }) => {
    if (task) {
      onSave(task.id, data);
      onClose();
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <TaskStatusSelect status={field.value} onStatusChange={field.onChange} />
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
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};