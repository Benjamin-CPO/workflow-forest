import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ProjectEditFormProps {
  title: string;
  description: string;
  dueDate: string;
  figmaWorkfile: string;
  figmaReviewFile: string;
  onSave: (data: {
    title: string;
    description: string;
    dueDate: string;
    figmaWorkfile?: string;
    figmaReviewFile?: string;
  }) => void;
  onCancel: () => void;
}

export const ProjectEditForm = ({
  title,
  description,
  dueDate,
  figmaWorkfile,
  figmaReviewFile,
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
    };
  }
};