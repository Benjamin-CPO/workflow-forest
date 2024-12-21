import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatSectionProps {
  projectMilestones: Array<{
    id: number;
    title: string;
  }>;
  className?: string;
  collapsedWidth?: string;
}

const createInitialMessages = (milestones: Array<{ id: number; title: string }>, projectId: string) => {
  const savedMessages = localStorage.getItem(`project-${projectId}-messages`);
  if (savedMessages) {
    return JSON.parse(savedMessages);
  }

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

export const ChatSection = ({ projectMilestones, className, collapsedWidth = "50px" }: ChatSectionProps) => {
  const projectId = window.location.pathname.split('/')[2];

  const [messagesByMilestone, setMessagesByMilestone] = useState(() => 
    createInitialMessages(projectMilestones, projectId)
  );
  const [currentMilestone, setCurrentMilestone] = useState(() => 
    projectMilestones[0]?.title.toLowerCase().replace(/\s+/g, '-') || ''
  );
  const [newMessage, setNewMessage] = useState("");
  const [mentionOpen, setMentionOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

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

    const updatedMessages = {
      ...messagesByMilestone,
      [currentMilestone]: [...(messagesByMilestone[currentMilestone] || []), message]
    };

    setMessagesByMilestone(updatedMessages);
    localStorage.setItem(`project-${projectId}-messages`, JSON.stringify(updatedMessages));
    setNewMessage("");
  };

  const handleEditMessage = (messageId: number, newMessageText: string) => {
    const updatedMessages = {
      ...messagesByMilestone,
      [currentMilestone]: messagesByMilestone[currentMilestone].map(msg =>
        msg.id === messageId ? { ...msg, message: newMessageText } : msg
      )
    };
    setMessagesByMilestone(updatedMessages);
    localStorage.setItem(`project-${projectId}-messages`, JSON.stringify(updatedMessages));
  };

  const handleDeleteMessage = (messageId: number) => {
    const updatedMessages = {
      ...messagesByMilestone,
      [currentMilestone]: messagesByMilestone[currentMilestone].filter(msg => msg.id !== messageId)
    };
    setMessagesByMilestone(updatedMessages);
    localStorage.setItem(`project-${projectId}-messages`, JSON.stringify(updatedMessages));
  };

  return (
    <div 
      className={cn(
        "flex flex-col bg-background border rounded-lg transition-all duration-300",
        isExpanded ? className : `w-[${collapsedWidth}]`
      )}
      style={{ width: isExpanded ? undefined : collapsedWidth }}
    >
      <div className="p-4 border-b flex justify-between items-center">
        {isExpanded ? (
          <>
            <h2 className="font-semibold">Project Chat</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
              className="ml-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(true)}
            className="w-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {isExpanded && (
        <>
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
        </>
      )}
    </div>
  );
};