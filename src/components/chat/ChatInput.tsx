import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useRef } from "react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  mentionOpen: boolean;
  setMentionOpen: (open: boolean) => void;
  suggestions: {
    tasks: Array<{ id: number; title: string }>;
    milestones: Array<{ id: number; title: string }>;
  };
  handleMentionSelect: (type: 'Task' | 'Milestone', title: string) => void;
  cursorPosition: number;
  setCursorPosition: (position: number) => void;
}

export const ChatInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  mentionOpen,
  setMentionOpen,
  suggestions,
  handleMentionSelect,
  cursorPosition,
  setCursorPosition,
}: ChatInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    setCursorPosition(e.target.selectionStart || 0);

    const lastAtSign = value.lastIndexOf('@', cursorPosition);
    if (lastAtSign !== -1 && lastAtSign === value.length - 1) {
      setMentionOpen(true);
    } else {
      setMentionOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type @ to mention tasks or milestones... (Press Enter to send)"
            className="flex-1"
          />
          <Popover open={mentionOpen} onOpenChange={setMentionOpen}>
            <PopoverTrigger asChild>
              <div />
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandList>
                  <CommandGroup heading="Tasks">
                    {suggestions.tasks.map((task) => (
                      <CommandItem
                        key={task.id}
                        onSelect={() => handleMentionSelect('Task', task.title)}
                      >
                        📋 {task.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandGroup heading="Milestones">
                    {suggestions.milestones.map((milestone) => (
                      <CommandItem
                        key={milestone.id}
                        onSelect={() => handleMentionSelect('Milestone', milestone.title)}
                      >
                        🎯 {milestone.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={handleSendMessage} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};