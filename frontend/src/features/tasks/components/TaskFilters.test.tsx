import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TaskFilters } from "./TaskFilters";
import { TooltipProvider } from "@/features/shared/components/ui/tooltip";
import React from "react";

// Mock tRPC
vi.mock("@/api/trpc", () => ({
  trpc: {
    auth: {
      list: {
        useQuery: vi.fn().mockReturnValue({ data: [] }),
      },
    },
  },
}));

// Mock filters store
const mockUpdateTaskFilter = vi.fn();
const mockClearFilters = vi.fn();

vi.mock("@/features/tasks/stores/filters.store", () => ({
  useFiltersStore: () => ({
    taskFilters: {
      search: "test search",
      status: "todo",
      priority: "high",
    },
    updateTaskFilter: mockUpdateTaskFilter,
    clearFilters: mockClearFilters,
  }),
  useActiveFiltersCount: () => 2, // Mocking that we have active filters
}));

// Wrap component with necessary providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <TooltipProvider>
      {component}
    </TooltipProvider>
  );
};

describe("TaskFilters Accessibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("search input should have an accessible label", () => {
    renderWithProviders(<TaskFilters />);

    // Check if input has aria-label="Search tasks"
    const searchInput = screen.getByPlaceholderText("Search tasks...");
    expect(searchInput).toHaveAttribute("aria-label", "Search tasks");
  });

  it("clear filter buttons should have accessible labels", () => {
    renderWithProviders(<TaskFilters />);

    // Check for Status filter clear button
    // The badge text contains "Status: Todo"
    // We want to find the button inside it and check its aria-label

    // Using getAllByRole("button") and filtering might be easiest if we don't have the label yet
    const buttons = screen.getAllByRole("button");

    // We expect a button with aria-label="Clear Status filter"
    const statusClearButton = buttons.find(
      (btn) => btn.getAttribute("aria-label") === "Clear Status filter"
    );
    expect(statusClearButton).toBeInTheDocument();

    // We expect a button with aria-label="Clear Priority filter"
    const priorityClearButton = buttons.find(
      (btn) => btn.getAttribute("aria-label") === "Clear Priority filter"
    );
    expect(priorityClearButton).toBeInTheDocument();
  });
});
