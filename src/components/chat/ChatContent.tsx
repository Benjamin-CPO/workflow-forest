import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { ChatMessage } from "./ChatMessage";
import { useEffect, useRef } from "react";

interface ChatContentProps {
  projectMilestones: Array<{ id: number; title: string }>;
  currentMilestone: string;
  setCurrentMilestone: (milestone: string) => void;
  messagesByMilestone: Record<string, Array<{
    id: number;
    message: string;
    sender: string;
    timestamp: string;
    milestone: string;
  }>>;
  handleEditMessage: (messageId: number, newMessageText: string) => void;
  handleDeleteMessage: (messageId: number) => void;
}

export const ChatContent = ({
  projectMilestones,
  currentMilestone,
  setCurrentMilestone,
  messagesByMilestone,
  handleEditMessage,
  handleDeleteMessage,
}: ChatContentProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesByMilestone]);

  return (
    <Tabs value={currentMilestone} onValueChange={setCurrentMilestone} className="flex-1 flex flex-col h-full">
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
            style={{ height: 'calc(100% - 45px)' }}
          >
            <div className="space-y-4">
              {messagesByMilestone[milestoneKey]?.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No messages yet
                </div>
              ) : (
                messagesByMilestone[milestoneKey]?.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    id={msg.id}
                    message={msg.message}
                    sender={msg.sender}
                    timestamp={msg.timestamp}
                    onEdit={handleEditMessage}
                    onDelete={handleDeleteMessage}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
};