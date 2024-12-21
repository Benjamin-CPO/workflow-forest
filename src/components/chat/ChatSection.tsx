import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatSectionProps {
  projectMilestones: Array<{
    id: number;
    title: string;
  }>;
}

// Temporary mock data with tagged messages
const createInitialMessages = (milestones: Array<{ id: number; title: string }>) => {
  return milestones.reduce((acc, milestone) => {
    acc[milestone.title.toLowerCase().replace(/\s+/g, '-')] = [];
    return acc;
  }, {} as Record<string, Array<{
    id: number;
    message: string;
    sender: string;
    timestamp: string;
    milestone: string;
  }>>);
};

export const ChatSection = ({ projectMilestones }: ChatSectionProps) => {
  const [messagesByMilestone, setMessagesByMilestone] = useState(() => 
    createInitialMessages(projectMilestones)
  );
  const [currentMilestone, setCurrentMilestone] = useState(() => 
    projectMilestones[0]?.title.toLowerCase().replace(/\s+/g, '-') || ''
  );
  const [newMessage, setNewMessage] = useState("");
  const [mentionOpen, setMentionOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Mock data for suggestions - now using project-specific tasks
  const suggestions = {
    tasks: [
      { id: 1, title: "UI/UX Design" },
      { id: 2, title: "Backend Integration" }
    ],
    milestones: projectMilestones
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
            {projectMilestones.map((milestone) => (
              <TabsTrigger 
                key={milestone.id} 
                value={milestone.title.toLowerCase().replace(/\s+/g, '-')}
              >
                {milestone.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {projectMilestones.map((milestone) => {
          const milestoneKey = milestone.title.toLowerCase().replace(/\s+/g, '-');
          return (
            <TabsContent 
              key={milestone.id} 
              value={milestoneKey} 
              className="flex-1 overflow-y-auto p-4 space-y-4 mt-0"
            >
              {messagesByMilestone[milestoneKey]?.map((msg) => (
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
          );
        })}
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