import { Calendar } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface ProjectDisplayProps {
  title: string;
  description: string;
  dueDate: string;
  figmaWorkfile?: string;
  figmaReviewFile?: string;
  onEdit: () => void;
}

export const ProjectDisplay = ({
  title,
  description,
  dueDate,
  figmaWorkfile,
  figmaReviewFile,
  onEdit,
}: ProjectDisplayProps) => {
  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-muted-foreground">
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              />
            ),
          }}
        >
          {description}
        </ReactMarkdown>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <Calendar className="h-4 w-4 mr-2" />
        Due {dueDate}
      </div>
      {(figmaWorkfile || figmaReviewFile) && (
        <div className="space-y-2">
          {figmaWorkfile && (
            <a
              href={figmaWorkfile}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-blue-500 hover:underline"
            >
              📝 Figma Workfile
            </a>
          )}
          {figmaReviewFile && (
            <a
              href={figmaReviewFile}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-blue-500 hover:underline"
            >
              👀 Figma Review File
            </a>
          )}
        </div>
      )}
    </div>
  );
};