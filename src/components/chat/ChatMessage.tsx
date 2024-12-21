interface ChatMessageProps {
  message: string;
  sender: string;
  timestamp: string;
}

export const ChatMessage = ({ message, sender, timestamp }: ChatMessageProps) => {
  // Function to parse and format tagged content
  const formatMessage = (text: string) => {
    // Match @[Task: task title] or @[Milestone: milestone title]
    const tagPattern = /@\[(Task|Milestone):\s([^\]]+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = tagPattern.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Add the tagged element with appropriate styling
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

    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return <>{parts}</>;
  };

  return (
    <div className="flex flex-col space-y-1 mb-4">
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-sm">{sender}</span>
        <span className="text-xs text-muted-foreground">{timestamp}</span>
      </div>
      <p className="text-sm">{formatMessage(message)}</p>
    </div>
  );
};