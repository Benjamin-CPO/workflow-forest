import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Temporary mock data with tagged messages for each milestone
const initialMessagesByMilestone = {
  "design": [
    {
      id: 1,
      message: "Hey team, how's the progress on @[Task: Design Homepage]?",
      sender: "John Doe",
      timestamp: "2:30 PM",
      milestone: "design"
    },
    {
      id: 2,
      message: "@[Milestone: Design Phase] is almost complete! I've just pushed the latest changes.",
      sender: "Jane Smith",
      timestamp: "2:32 PM",
      milestone: "design"
    }
  ],
  "development": [
    {
      id: 3,
      message: "Starting work on @[Task: Mobile Layout]",
      sender: "Alice Johnson",
      timestamp: "3:15 PM",
      milestone: "development"
    }
  ]
};

export const ChatSection = () => {
  const [messagesByMilestone, setMessagesByMilestone] = useState(initialMessagesByMilestone);
  const [currentMilestone, setCurrentMilestone] = useState("design");
  const [newMessage, setNewMessage] = useState("");
  const [mentionOpen, setMentionOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

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

  const handleMentionSelect = (type: 'Task' | 'Milestone', title: string) => {
    const beforeMention = newMessage.slice(0, newMessage.lastIndexOf('@'));
    const mention = `@[${type}: ${title}] `;
    setNewMessage(beforeMention + mention);
    setMentionOpen(false);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Object.values(messagesByMilestone).flat().length + 1,
      message: newMessage,
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      milestone: currentMilestone
    };

    setMessagesByMilestone(prev => ({
      ...prev,
      [currentMilestone]: [...(prev[currentMilestone] || []), message]
    }));
    setNewMessage("");
  };

  const handleEditMessage = (messageId: number, newMessageText: string) => {
    setMessagesByMilestone(prev => ({
      ...prev,
      [currentMilestone]: prev[currentMilestone].map(msg =>
        msg.id === messageId ? { ...msg, message: newMessageText } : msg
      )
    }));
  };

  const handleDeleteMessage = (messageId: number) => {
    setMessagesByMilestone(prev => ({
      ...prev,
      [currentMilestone]: prev[currentMilestone].filter(msg => msg.id !== messageId)
    }));
  };

  return (
    <div className="flex flex-col h-[500px] bg-background border rounded-lg">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Project Chat</h2>
      </div>
      
      <Tabs value={currentMilestone} onValueChange={setCurrentMilestone} className="flex-1 flex flex-col">
        <div className="px-4 border-b">
          <TabsList>
            <TabsTrigger value="design">Design Phase</TabsTrigger>
            <TabsTrigger value="development">Development Phase</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="design" className="flex-1 overflow-y-auto p-4 space-y-4 mt-0">
          {messagesByMilestone.design?.map((msg) => (
            <ChatMessage
              key={msg.id}
              id={msg.id}
              message={msg.message}
              sender={msg.sender}
              timestamp={msg.timestamp}
              onEdit={handleEditMessage}
              onDelete={handleDeleteMessage}
            />
          ))}
        </TabsContent>

        <TabsContent value="development" className="flex-1 overflow-y-auto p-4 space-y-4 mt-0">
          {messagesByMilestone.development?.map((msg) => (
            <ChatMessage
              key={msg.id}
              id={msg.id}
              message={msg.message}
              sender={msg.sender}
              timestamp={msg.timestamp}
              onEdit={handleEditMessage}
              onDelete={handleDeleteMessage}
            />
          ))}
        </TabsContent>
      </Tabs>

      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        mentionOpen={mentionOpen}
        setMentionOpen={setMentionOpen}
        suggestions={suggestions}
        handleMentionSelect={handleMentionSelect}
        cursorPosition={cursorPosition}
        setCursorPosition={setCursorPosition}
      />
    </div>
  );
};