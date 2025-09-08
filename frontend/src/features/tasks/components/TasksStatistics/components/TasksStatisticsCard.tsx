import { Card } from "@/components/ui/card";
import { cn } from "@/utils/utils";
import { TrendingUp } from "lucide-react";
interface Props {
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

const TaskStatisticsCard: React.FC<Props> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn("card-elevated p-6 hover-lift", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{value}</h3>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                <TrendingUp
                  className={cn("h-3 w-3", !trend.isPositive && "rotate-180")}
                />
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-primary/10 text-primary">{icon}</div>
      </div>
    </Card>
  );
};
export default TaskStatisticsCard;
