import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChatHeader } from "./ChatHeader";
import { ChatContent } from "./ChatContent";
import { ChatInput } from "./ChatInput";

interface ChatSectionProps {
  projectMilestones: Array<{
    id: number;
    title: string;
  }>;
  className?: string;
  collapsedWidth?: string;
  onExpandChange?: (expanded: boolean) => void;
}

const createInitialMessages = (milestones: Array<{ id: number; title: string }>, projectId: string) => {
  const storageKey = `project-${projectId}-messages`;
  const savedMessages = localStorage.getItem(storageKey);
  
  if (savedMessages) {
    return JSON.parse(savedMessages);
  }

  const initialMessages = milestones.reduce((acc, milestone) => {
    acc[milestone.title.toLowerCase().replace(/\s+/g, '-')] = [];
    return acc;
  }, {} as Record<string, Array<{
    id: number;
    message: string;
    sender: string;
    timestamp: string;
    milestone: string;
  }>>);

  localStorage.setItem(storageKey, JSON.stringify(initialMessages));
  return initialMessages;
};

export const ChatSection = ({ 
  projectMilestones, 
  className, 
  collapsedWidth = "50px",
  onExpandChange 
}: ChatSectionProps) => {
  const projectId = window.location.pathname.split('/')[2];
  const [isExpanded, setIsExpanded] = useState(true);
  const [messagesByMilestone, setMessagesByMilestone] = useState(() => 
    createInitialMessages(projectMilestones, projectId)
  );
  const [currentMilestone, setCurrentMilestone] = useState(() => 
    projectMilestones[0]?.title.toLowerCase().replace(/\s+/g, '-') || ''
  );
  const [newMessage, setNewMessage] = useState("");
  const [mentionOpen, setMentionOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const suggestions = {
    tasks: [
      { id: 1, title: "UI/UX Design" },
      { id: 2, title: "Backend Integration" }
    ],
    milestones: projectMilestones
  };

  const handleExpandChange = (expanded: boolean) => {
    setIsExpanded(expanded);
    onExpandChange?.(expanded);
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

  useEffect(() => {
    setMessagesByMilestone(createInitialMessages(projectMilestones, projectId));
  }, [projectMilestones, projectId]);

  return (
    <div 
      className={cn(
        "flex flex-col bg-background border rounded-lg transition-all duration-300 h-[600px]",
        isExpanded ? className : "w-[50px]"
      )}
    >
      <ChatHeader isExpanded={isExpanded} onExpandChange={handleExpandChange} />
      
      {isExpanded && (
        <>
          <ChatContent
            projectMilestones={projectMilestones}
            currentMilestone={currentMilestone}
            setCurrentMilestone={setCurrentMilestone}
            messagesByMilestone={messagesByMilestone}
            handleEditMessage={handleEditMessage}
            handleDeleteMessage={handleDeleteMessage}
          />

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