import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "./ChatMessage";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Temporary mock data with tagged messages
const initialMessages = [
  {
    id: 1,
    message: "Hey team, how's the progress on @[Task: Design Homepage]?",
    sender: "John Doe",
    timestamp: "2:30 PM"
  },
  {
    id: 2,
    message: "@[Milestone: Design Phase] is almost complete! I've just pushed the latest changes.",
    sender: "Jane Smith",
    timestamp: "2:32 PM"
  }
];

export const ChatSection = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [mentionOpen, setMentionOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data for suggestions
  const suggestions = {
    tasks: [
      { id: 1, title: "Design Homepage" },
      { id: 2, title: "Mobile Layout" },
      { id: 3, title: "Contact Form" }
    ],
    milestones: [
      { id: 1, title: "Design Phase" },
      { id: 2, title: "Development Phase" }
    ]
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    setCursorPosition(e.target.selectionStart || 0);

    // Check if we should show mentions
    const lastAtSign = value.lastIndexOf('@', cursorPosition);
    if (lastAtSign !== -1 && lastAtSign === value.length - 1) {
      setMentionOpen(true);
    } else {
      setMentionOpen(false);
    }
  };

  const handleMentionSelect = (type: 'Task' | 'Milestone', title: string) => {
    const beforeMention = newMessage.slice(0, newMessage.lastIndexOf('@'));
    const mention = `@[${type}: ${title}] `;
    setNewMessage(beforeMention + mention);
    setMentionOpen(false);
    inputRef.current?.focus();
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      message: newMessage,
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-background border rounded-lg">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Project Chat</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.message}
            sender={msg.sender}
            timestamp={msg.timestamp}
          />
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type @ to mention tasks or milestones..."
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
    </div>
  );
};