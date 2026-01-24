import { Card } from "@/features/shared/components/ui/card";
import { cn } from "@/features/shared/utils";

interface TaskStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const TaskStatCard: React.FC<TaskStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn("p-4 hover:shadow-md transition-shadow duration-200 border-border/50 bg-background/50 backdrop-blur-sm", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold tracking-tight">{value}</h3>
          </div>
          {subtitle && (
            <p className="text-[10px] text-muted-foreground line-clamp-1">{subtitle}</p>
          )}
        </div>
        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">{icon}</div>
      </div>
    </Card>
  );
};
export default TaskStatCard;
