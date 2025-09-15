import { Card } from "@/features/shared/components/ui/card";
import { Calendar } from "lucide-react";

const CalendarView = () => {
  return (
    <Card className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-semibold">Calendar View</h3>
        <p className="text-muted-foreground max-w-sm">
          Calendar view with task scheduling would be implemented here using a
          library like FullCalendar.
        </p>
      </div>
    </Card>
  );
};

export default CalendarView;
