interface ChatMessageProps {
  message: string;
  sender: string;
  timestamp: string;
}

export const ChatMessage = ({ message, sender, timestamp }: ChatMessageProps) => {
  return (
    <div className="flex flex-col space-y-1 mb-4">
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-sm">{sender}</span>
        <span className="text-xs text-muted-foreground">{timestamp}</span>
      </div>
      <p className="text-sm">{message}</p>
    </div>
  );
};