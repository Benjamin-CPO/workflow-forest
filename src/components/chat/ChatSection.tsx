import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChatHeader } from "./ChatHeader";
import { ChatContent } from "./ChatContent";
import { ChatInput } from "./ChatInput";
import { useChat } from "@/hooks/useChat";

interface ChatSectionProps {
  projectMilestones: Array<{
    id: number;
    title: string;
    tasks?: Array<{
      id: number;
      title: string;
    }>;
  }>;
  className?: string;
  collapsedWidth?: string;
  onExpandChange?: (expanded: boolean) => void;
}

export const ChatSection = ({ 
  projectMilestones, 
  className, 
  collapsedWidth = "50px",
  onExpandChange 
}: ChatSectionProps) => {
  const projectId = window.location.pathname.split('/')[2];
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    newMessage,
    setNewMessage,
    mentionOpen,
    setMentionOpen,
    cursorPosition,
    setCursorPosition,
    messagesByMilestone,
    currentMilestone,
    setCurrentMilestone,
    suggestions,
    handleMentionSelect,
    handleSendMessage,
    handleEditMessage,
    handleDeleteMessage
  } = useChat(projectId, projectMilestones);

  const handleExpandChange = (expanded: boolean) => {
    setIsExpanded(expanded);
    onExpandChange?.(expanded);
  };

  return (
    <div 
      className={cn(
        "flex flex-col bg-background border rounded-lg transition-all duration-300",
        isExpanded ? className : "w-[50px]"
      )}
      style={{ 
        height: '600px',
        maxHeight: '600px'
      }}
    >
      <ChatHeader isExpanded={isExpanded} onExpandChange={handleExpandChange} />
      
      {isExpanded && (
        <>
          <div className="flex-1 min-h-0">
            <ChatContent
              projectMilestones={projectMilestones}
              currentMilestone={currentMilestone}
              setCurrentMilestone={setCurrentMilestone}
              messagesByMilestone={messagesByMilestone}
              handleEditMessage={handleEditMessage}
              handleDeleteMessage={handleDeleteMessage}
            />
          </div>

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