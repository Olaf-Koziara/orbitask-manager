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
    <Card
      className={cn(
        "p-3.5 hover:shadow-sm hover:bg-background/70 transition-all duration-200 border-0 bg-background/50 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground/80">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-semibold tracking-tight text-foreground/95">
              {value}
            </h3>
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground/70 line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 p-2 rounded-md bg-primary/8 text-primary/90">
          {icon}
        </div>
      </div>
    </Card>
  );
};
export default TaskStatCard;
