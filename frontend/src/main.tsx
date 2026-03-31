import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TooltipProvider } from "@/features/shared/components/ui/tooltip";
import { ActiveFilters } from "@/features/projects/components/ActiveFilters";
import "./index.css";
import "./App.css";

const MOCK_FILTERS = {
  search: "test",
  createdBy: "1",
  color: "#ff0000",
};

const MOCK_OPTIONS = {
  users: [{ _id: "1", name: "Jules" }],
  colors: [{ value: "#ff0000", label: "Red" }],
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">ActiveFilters Demo</h1>
        <ActiveFilters
          filters={MOCK_FILTERS}
          filterOptions={MOCK_OPTIONS}
          activeFiltersCount={3}
          onClearFilter={(k) => console.log("Clear", k)}
        />
      </div>
    </TooltipProvider>
  </StrictMode>
);