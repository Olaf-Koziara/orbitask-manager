import { render, screen, fireEvent } from "@testing-library/react";
import KanbanColumn from "./KanbanColumn";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useTaskDialogStore } from "@/features/tasks/stores/taskDialog.store";
import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import React from "react";

// Mock dependencies
vi.mock("@/features/tasks/hooks/useTasks", () => ({
  useTasks: vi.fn(),
}));

vi.mock("@/features/tasks/stores/taskDialog.store", () => ({
  useTaskDialogStore: vi.fn(),
}));

vi.mock("@dnd-kit/core", () => ({
  useDroppable: () => ({
    isOver: false,
    over: null,
    active: null,
    setNodeRef: vi.fn(),
  }),
}));

vi.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: () => ({
    getVirtualItems: () => [],
    getTotalSize: () => 0,
    measureElement: vi.fn(),
  }),
}));

vi.mock("@/features/shared/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) => {
    if (asChild) {
      return children;
    }
    return <div>{children}</div>;
  },
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div data-testid="tooltip-content">{children}</div>,
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/features/shared/components/ui/button", () => ({
  Button: ({ children, "aria-label": ariaLabel, onClick }: { children: React.ReactNode, "aria-label"?: string, onClick?: () => void }) => (
    <button aria-label={ariaLabel} onClick={onClick} data-testid="button-trigger">
      {children}
    </button>
  ),
}));


describe("KanbanColumn Accessibility", () => {
  const mockOpenDialog = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTasks as unknown as Mock).mockReturnValue({
      tasks: [],
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    (useTaskDialogStore as unknown as Mock).mockReturnValue({
      openDialog: mockOpenDialog,
    });
  });

  it("should have dynamic aria-label on Add Task button", () => {
    render(<KanbanColumn title="In Progress" status="in_progress" />);
    const buttons = screen.getAllByRole("button", { name: "Add task to In Progress" });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should make empty state div keyboard accessible", () => {
    render(<KanbanColumn title="To Do" status="todo" />);
    const emptyState = screen.getAllByRole("button", { name: "Add task to To Do" })[1];

    expect(emptyState).toHaveAttribute("tabIndex", "0");

    // Test Enter key
    fireEvent.keyDown(emptyState, { key: "Enter" });
    expect(mockOpenDialog).toHaveBeenCalledWith({
      initialData: { status: "todo" },
      viewMode: "create",
    });

    mockOpenDialog.mockClear();

    // Test Space key
    fireEvent.keyDown(emptyState, { key: " " });
    expect(mockOpenDialog).toHaveBeenCalledWith({
      initialData: { status: "todo" },
      viewMode: "create",
    });
  });
});
