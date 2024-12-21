import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageActions } from "./MessageActions";

interface ChatMessageProps {
  id: number;
  message: string;
  sender: string;
  timestamp: string;
  onEdit: (id: number, newMessage: string) => void;
  onDelete: (id: number) => void;
}

export const ChatMessage = ({ 
  id,
  message, 
  sender, 
  timestamp,
  onEdit,
  onDelete,
}: ChatMessageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);

  const handleSaveEdit = () => {
    onEdit(id, editedMessage);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedMessage(message);
    }
  };

  // Function to parse and format tagged content
  const formatMessage = (text: string) => {
    const tagPattern = /@\[(Task|Milestone):\s([^\]]+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = tagPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const [, type, title] = match;
      parts.push(
        <span
          key={match.index}
          className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        >
          {type === "Task" ? "📋" : "🎯"} {title}
        </span>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return <>{parts}</>;
  };

  return (
    <div className="flex flex-col space-y-1 mb-4 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sm">{sender}</span>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MessageActions
            onEdit={() => setIsEditing(true)}
            onDelete={() => onDelete(id)}
          />
        </div>
      </div>
      {isEditing ? (
        <div className="flex space-x-2">
          <Input
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
          />
          <Button size="sm" onClick={handleSaveEdit}>Save</Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => {
              setIsEditing(false);
              setEditedMessage(message);
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <p className="text-sm">{formatMessage(message)}</p>
      )}
    </div>
  );
};