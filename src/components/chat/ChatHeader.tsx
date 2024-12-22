import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ChatHeaderProps {
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

export const ChatHeader = ({ isExpanded, onExpandChange }: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b flex justify-between items-center">
      {isExpanded ? (
        <>
          <h2 className="text-xl font-semibold">Project Chat</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onExpandChange(false)}
            className="ml-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onExpandChange(true)}
          className="w-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};