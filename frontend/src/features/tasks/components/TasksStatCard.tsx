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
  const trendLabel = trend
    ? `${trend.isPositive ? "+" : "-"}${Math.abs(trend.value)}%`
    : null;

  return (
    <Card
      className={cn(
        "rounded-xl border border-border/60 bg-background/70 px-3 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors duration-200 hover:bg-background/90",
        className,
      )}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground/75">
            {title}
          </p>
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-muted/60 text-foreground/75">
            {icon}
          </div>
        </div>

        <div className="flex items-end justify-between gap-2">
          <h3 className="text-lg font-semibold leading-none tracking-tight text-foreground/95">
            {value}
          </h3>

          {trendLabel && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                trend?.isPositive
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-rose-500/10 text-rose-600",
              )}
            >
              {trendLabel}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-[11px] text-muted-foreground/70">{subtitle}</p>
        )}
      </div>
    </Card>
  );
};
export default TaskStatCard;
