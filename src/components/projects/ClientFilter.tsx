import { Client } from "@/types/project";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ClientFilterProps {
  clients: Client[];
  selectedClientIds: string[];
  onClientToggle: (clientId: string) => void;
}

export const ClientFilter = ({ clients, selectedClientIds, onClientToggle }: ClientFilterProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">Filter by Client</label>
      <Select
        value={selectedClientIds[0]}
        onValueChange={onClientToggle}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select clients" />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-[200px]">
            <SelectItem value="all">All Clients</SelectItem>
            <SelectItem value="-1">No Client</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id.toString()}>
                {client.name}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
      <div className="flex flex-wrap gap-2">
        {selectedClientIds.map((id) => (
          <Badge 
            key={id} 
            variant="secondary"
            className="cursor-pointer"
            onClick={() => onClientToggle(id)}
          >
            {id === "all" 
              ? "All Clients" 
              : id === "-1" 
                ? "No Client" 
                : clients.find(c => c.id.toString() === id)?.name}
            ×
          </Badge>
        ))}
      </div>
    </div>
  );
};