import { Card } from "@/features/shared/components/ui/card";
import { List } from "lucide-react";

const ListView = () => {
  return (
    <Card className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <List className="h-16 w-16 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-semibold">List View</h3>
        <p className="text-muted-foreground max-w-sm">
          Detailed list view with sorting and pagination would be implemented
          here.
        </p>
      </div>
    </Card>
  );
};

export default ListView;
