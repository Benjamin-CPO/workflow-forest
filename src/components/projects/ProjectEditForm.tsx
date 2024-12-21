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
import { useEffect, useState } from "react";

interface ProjectEditFormProps {
  title: string;
  description: string;
  dueDate: string;
  figmaWorkfile: string;
  figmaReviewFile: string;
  status?: 'priority' | 'on-hold' | null;
  clientId?: number;
  onSave: (data: {
    title: string;
    description: string;
    dueDate: string;
    figmaWorkfile?: string;
    figmaReviewFile?: string;
    status?: 'priority' | 'on-hold' | null;
    clientId?: number;
  }) => void;
  onCancel: () => void;
}

interface Client {
  id: number;
  name: string;
}

export const ProjectEditForm = ({
  title,
  description,
  dueDate,
  figmaWorkfile,
  figmaReviewFile,
  status,
  clientId,
  onSave,
  onCancel,
}: ProjectEditFormProps) => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    setClients(storedClients);
  }, []);

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
          value={status || 'none'}
          onValueChange={(value: 'priority' | 'on-hold' | 'none') => 
            onSave({ ...getFormData(), status: value === 'none' ? null : value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select project status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Regular Project</SelectItem>
            <SelectItem value="priority">Priority Project</SelectItem>
            <SelectItem value="on-hold">Project on Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Client</Label>
        <Select
          value={clientId?.toString() || 'no-client'}
          onValueChange={(value) => 
            onSave({ ...getFormData(), clientId: value === 'no-client' ? undefined : Number(value) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-client">No Client</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id.toString()}>
                {client.name}
              </SelectItem>
            ))}
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
      clientId,
    };
  }
};