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

interface Client {
  id: number;
  name: string;
}

interface ProjectEditFormProps {
  title: string;
  description: string;
  dueDate: string;
  figmaWorkfile?: string;
  figmaReviewFile?: string;
  status?: 'priority' | null;
  clientId?: number;
  onSave: (data: {
    title: string;
    description: string;
    dueDate: string;
    figmaWorkfile?: string;
    figmaReviewFile?: string;
    status?: 'priority' | null;
    clientId?: number;
  }) => void;
  onCancel: () => void;
}

export const ProjectEditForm = ({
  title: initialTitle,
  description: initialDescription,
  dueDate: initialDueDate,
  figmaWorkfile: initialFigmaWorkfile,
  figmaReviewFile: initialFigmaReviewFile,
  status: initialStatus,
  clientId: initialClientId,
  onSave,
  onCancel,
}: ProjectEditFormProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    title: initialTitle,
    description: initialDescription,
    dueDate: initialDueDate,
    figmaWorkfile: initialFigmaWorkfile,
    figmaReviewFile: initialFigmaReviewFile,
    status: initialStatus,
    clientId: initialClientId,
  });

  useEffect(() => {
    const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    setClients(storedClients);
  }, []);

  const handleSave = () => {
    onSave(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="flex-1 space-y-4">
      <Input
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="Project title"
        className="text-2xl font-bold"
      />
      <Textarea
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Project description (You can use [link text](url) for links)"
        className="resize-none"
      />
      <div className="grid gap-2">
        <Label>Project Priority</Label>
        <Select
          value={formData.status || 'queue'}
          onValueChange={(value: 'priority' | 'queue') => 
            handleChange('status', value === 'queue' ? null : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select project priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="queue">In Queue</SelectItem>
            <SelectItem value="priority">Priority Project</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Client</Label>
        <Select
          value={formData.clientId?.toString() || 'no-client'}
          onValueChange={(value) => 
            handleChange('clientId', value === 'no-client' ? undefined : Number(value))
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
        value={formData.dueDate.split(",")[0]}
        onChange={(e) => handleChange('dueDate', e.target.value)}
        className="w-full"
      />
      <Input
        type="url"
        value={formData.figmaWorkfile}
        onChange={(e) => handleChange('figmaWorkfile', e.target.value)}
        placeholder="Figma Workfile URL"
        className="w-full"
      />
      <Input
        type="url"
        value={formData.figmaReviewFile}
        onChange={(e) => handleChange('figmaReviewFile', e.target.value)}
        placeholder="Figma Review File URL"
        className="w-full"
      />
      <div className="flex gap-2">
        <Button onClick={handleSave}>
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
};