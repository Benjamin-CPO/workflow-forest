interface StatusLabelProps {
  color: string;
  label: string;
  percentage: number;
}

export const StatusLabel = ({ color, label, percentage }: StatusLabelProps) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color}`} />
    <span className="text-sm font-medium">{label}</span>
    <span className="text-sm text-muted-foreground">
      ({percentage}%)
    </span>
  </div>
);