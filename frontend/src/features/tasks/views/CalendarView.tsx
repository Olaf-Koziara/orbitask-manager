import { Calendar } from "lucide-react";

const CalendarView = () => {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px] border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-white dark:bg-card shadow-sm flex items-center justify-center">
            <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Calendar View</h3>
        <p className="text-muted-foreground max-w-sm px-4">
          Task scheduling and timeline visualization coming soon.
        </p>
      </div>
    </div>
  );
};

export default CalendarView;
