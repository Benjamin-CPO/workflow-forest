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
>(({ className, segments, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary transition-all",
      className
    )}
    {...props}
  >
    <div className="flex h-full w-full transition-all">
      {segments.map((segment, index) => (
        <div
          key={index}
          className={cn("h-full transition-all duration-300 ease-in-out", segment.color)}
          style={{ width: `${segment.percentage}%` }}
        />
      ))}
    </div>
  </ProgressPrimitive.Root>
))

MultiColorProgress.displayName = "MultiColorProgress"

export { MultiColorProgress }