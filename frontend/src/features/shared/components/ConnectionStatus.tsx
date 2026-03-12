import { useState, useEffect } from 'react';
import { wsClient } from '@/api/trpc';
import { Badge } from '@/features/shared/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/features/shared/components/ui/tooltip';
import { Wifi, WifiOff } from 'lucide-react';

export const ConnectionStatus = () => {
  const [status, setStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');

  useEffect(() => {
    const updateStatus = () => {
      // @ts-expect-error - accessing internal state for status
      const state = wsClient.getWS()?.readyState;
      if (state === WebSocket.OPEN) setStatus('connected');
      else if (state === WebSocket.CONNECTING) setStatus('connecting');
      else setStatus('disconnected');
    };

    const interval = setInterval(updateStatus, 5000);
    updateStatus();

    return () => clearInterval(interval);
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center cursor-help" tabIndex={0}>
          <Badge
            variant={status === 'connected' ? 'default' : 'destructive'}
            className="flex items-center gap-1.5 px-2 py-0.5"
          >
            {status === 'connected' ? (
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
