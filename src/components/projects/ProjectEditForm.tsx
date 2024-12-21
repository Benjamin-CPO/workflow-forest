import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ProjectEditFormProps {
  title: string;
  description: string;
  dueDate: string;
  figmaWorkfile: string;
  figmaReviewFile: string;
  status?: 'priority' | 'on-hold' | null;
  onSave: (data: {
    title: string;
    description: string;
    dueDate: string;
    figmaWorkfile?: string;
    figmaReviewFile?: string;
    status?: 'priority' | 'on-hold' | null;
  }) => void;
  onCancel: () => void;
}

export const ProjectEditForm = ({
  title,
  description,
  dueDate,
  figmaWorkfile,
  figmaReviewFile,
  status,
  onSave,
  onCancel,
}: ProjectEditFormProps) => {
  return (
    <div className="flex-1 space-y-4">
      <Input
        value={title}
        onChange={(e) => onSave({ ...getFormData(), title: e.target.value })}
        placeholder="Project title"
        className="text-2xl font-bold"
      />
      <Textarea
        value={description}
        onChange={(e) => onSave({ ...getFormData(), description: e.target.value })}
        placeholder="Project description (You can use [link text](url) for links)"
        className="resize-none"
      />
      <div className="grid gap-2">
        <Label>Project Status</Label>
        <Select
          value={status || ''}
          onValueChange={(value: 'priority' | 'on-hold' | '') => 
            onSave({ ...getFormData(), status: value || null })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select project status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Regular Project</SelectItem>
            <SelectItem value="priority">Priority Project</SelectItem>
            <SelectItem value="on-hold">Project on Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Input
        type="date"
        value={dueDate.split(",")[0]}
        onChange={(e) => onSave({ ...getFormData(), dueDate: e.target.value })}
        className="w-full"
      />
      <Input
        type="url"
        value={figmaWorkfile}
        onChange={(e) => onSave({ ...getFormData(), figmaWorkfile: e.target.value })}
        placeholder="Figma Workfile URL"
        className="w-full"
      />
      <Input
        type="url"
        value={figmaReviewFile}
        onChange={(e) => onSave({ ...getFormData(), figmaReviewFile: e.target.value })}
        placeholder="Figma Review File URL"
        className="w-full"
      />
      <div className="flex gap-2">
        <Button onClick={() => onSave(getFormData())}>
          <Check className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );

  function getFormData() {
    return {
      title,
      description,
      dueDate,
      figmaWorkfile,
      figmaReviewFile,
      status,
    };
  }
};