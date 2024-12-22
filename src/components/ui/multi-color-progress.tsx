import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ProgressSegment {
  color: string;
  percentage: number;
}

interface MultiColorProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  segments: ProgressSegment[];
}

const MultiColorProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  MultiColorProgressProps
>(({ className, segments, ...props }, ref) => {
  // Calculate total percentage to ensure we fill the bar
  const totalPercentage = segments.reduce((sum, segment) => sum + segment.percentage, 0);
  
  // If total is less than 100, adjust the last segment to fill the remaining space
  const adjustedSegments = [...segments];
  if (totalPercentage < 100 && adjustedSegments.length > 0) {
    const lastSegment = adjustedSegments[adjustedSegments.length - 1];
    lastSegment.percentage += (100 - totalPercentage);
  }

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div className="flex h-full w-full">
        {adjustedSegments.map((segment, index) => (
          <div
            key={index}
            className={cn("h-full transition-all duration-300 ease-in-out", segment.color)}
            style={{ 
              width: `${segment.percentage}%`,
              transition: "width 0.3s ease-in-out"
            }}
          />
        ))}
      </div>
    </ProgressPrimitive.Root>
  )
}))

MultiColorProgress.displayName = "MultiColorProgress"

export { MultiColorProgress }