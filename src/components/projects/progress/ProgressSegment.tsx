interface ProgressSegmentProps {
  color: string;
  percentage: number;
}

export const ProgressSegment = ({ color, percentage }: ProgressSegmentProps) => (
  <div 
    className={`h-full ${color}`} 
    style={{ width: `${percentage}%` }} 
  />
);