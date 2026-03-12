import { useEffect, useState } from "react";
import { wsClient } from "@/api/trpc";
import { Badge } from "@/features/shared/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/features/shared/components/ui/tooltip";
import { Wifi, WifiOff } from "lucide-react";

type ConnectionBadgeStatus = "connected" | "connecting" | "disconnected";

const mapConnectionState = (state: string): ConnectionBadgeStatus => {
  if (state === "pending") {
    return "connected";
  }

  if (state === "connecting") {
    return "connecting";
  }

  return "disconnected";
};

export const ConnectionStatus = () => {
  const [status, setStatus] = useState<ConnectionBadgeStatus>("disconnected");

  useEffect(() => {
    setStatus(mapConnectionState(wsClient.connectionState.get().state));

    const subscription = wsClient.connectionState.subscribe({
      next(connection) {
        setStatus(mapConnectionState(connection.state));
      },
    });

    return () => {
      subscription.unsubscribe?.();
    };
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center cursor-help" tabIndex={0}>
          <Badge
            variant={status === "connected" ? "default" : "destructive"}
            className="flex items-center gap-1.5 px-2 py-0.5"
          >
            {status === "connected" ? (
              <Wifi className="h-3.5 w-3.5" />
            ) : (
              <WifiOff className="h-3.5 w-3.5" />
            )}
            <span className="text-[10px] uppercase font-bold tracking-wider">
              {status}
            </span>
          </Badge>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Real-time connection: {status}</p>
      </TooltipContent>
    </Tooltip>
  );
};
