import { useState } from "react";

interface Message {
  id: number;
  message: string;
  sender: string;
  timestamp: string;
  milestone: string;
}

export const useChat = (
  projectId: string,
  projectMilestones: Array<{
    id: number;
    title: string;
    tasks?: Array<{
      id: number;
      title: string;
    }>;
  }>
) => {
  const [newMessage, setNewMessage] = useState("");
  const [mentionOpen, setMentionOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const createInitialMessages = (milestones: Array<{ id: number; title: string }>) => {
    const storageKey = `project-${projectId}-messages`;
    const savedMessages = localStorage.getItem(storageKey);
    
    if (savedMessages) {
      return JSON.parse(savedMessages);
    }

    const initialMessages = milestones.reduce((acc, milestone) => {
      acc[milestone.title.toLowerCase().replace(/\s+/g, '-')] = [];
      return acc;
    }, {} as Record<string, Message[]>);

    localStorage.setItem(storageKey, JSON.stringify(initialMessages));
    return initialMessages;
  };

  const [messagesByMilestone, setMessagesByMilestone] = useState(() => 
    createInitialMessages(projectMilestones)
  );

  const [currentMilestone, setCurrentMilestone] = useState(() => 
    projectMilestones[0]?.title.toLowerCase().replace(/\s+/g, '-') || ''
  );

  // Get all tasks from current project's milestones
  const projectTasks = projectMilestones.flatMap(milestone => 
    (milestone.tasks || []).map(task => ({
      id: task.id,
      title: task.title
    }))
  );

  const suggestions = {
    tasks: projectTasks,
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

  return {
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
  };
};