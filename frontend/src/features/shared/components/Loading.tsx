import { Progress } from "@/features/shared/components/ui/progress";
import React from "react";

interface LoadingProps {
  message?: string;
}

/**
 * Global loading component for Suspense fallback
 */
export const Loading: React.FC<LoadingProps> = ({ message = "Loading..." }) => {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(timer);
          return prevProgress;
        }
        return prevProgress + 10;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
      <Progress value={progress} className="w-[60%] max-w-md mb-4" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};
