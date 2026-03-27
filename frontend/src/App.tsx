import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/features/shared/components/ThemeProvider";
import { Toaster } from "@/features/shared/components/ui/sonner";
import { TooltipProvider } from "@/features/shared/components/ui/tooltip";
import { queryClient, trpc, trpcClient } from "@/api/trpc";
import { router } from "@/router";
import { ProjectFormDialog } from "@/features/projects/components/ProjectFormDialog";
import { useState } from "react";
import { Button } from "./features/shared/components/ui/button";

function App() {
  const [open, setOpen] = useState(false);
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <TooltipProvider>
            <div className="p-8">
              <Button onClick={() => setOpen(true)}>Open Project Dialog</Button>
              <ProjectFormDialog
                open={open}
                onOpenChange={setOpen}
                onSubmit={() => {}}
              />
            </div>
            {/* <RouterProvider router={router} /> */}
            <Toaster position="top-right" richColors />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
