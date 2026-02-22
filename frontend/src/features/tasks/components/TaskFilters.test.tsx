import { render, screen, fireEvent } from "@testing-library/react";
import { TaskFilters } from "./TaskFilters";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Hoist mocks
const { mockState, updateTaskFilterMock, clearFiltersMock } = vi.hoisted(() => {
  return {
    mockState: {
      taskFilters: {
        search: "",
        status: undefined,
        priority: undefined,
        assignee: undefined,
        tags: [],
      },
      activeFiltersCount: 0,
    },
    updateTaskFilterMock: vi.fn(),
    clearFiltersMock: vi.fn(),
  };
});

// Mock tRPC
vi.mock("@/api/trpc", () => ({
  trpc: {
    auth: {
      list: {
        useQuery: () => ({ data: [] }),
      },
    },
  },
}));

vi.mock("@/features/tasks/stores/filters.store", () => ({
  useFiltersStore: () => ({
    taskFilters: mockState.taskFilters,
    updateTaskFilter: updateTaskFilterMock,
    clearFilters: clearFiltersMock,
  }),
  useActiveFiltersCount: () => mockState.activeFiltersCount,
}));

vi.mock("@/features/tasks/components/TaskSort", () => ({
  default: () => <div data-testid="task-sort">Sort</div>,
}));

describe("TaskFilters Accessibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset state
    mockState.taskFilters = {
      search: "",
      status: undefined,
      priority: undefined,
      assignee: undefined,
      tags: [],
    };
    mockState.activeFiltersCount = 0;
  });

  it("renders search input with aria-label", () => {
    render(<TaskFilters />);
    // This is expected to fail initially
    expect(screen.getByLabelText("Search tasks")).toBeInTheDocument();
  });

  it("renders clear filter button with accessible name", () => {
    // Setup state to show a filter
    mockState.taskFilters.status = "todo";
    mockState.activeFiltersCount = 1;

    render(<TaskFilters />);

    // The filter badge should be visible.
    // The button inside it should have a label.
    // Assuming status label for 'todo' is 'Todo' (default case) or whatever is in config
    // The test will fail on getByLabelText("Remove Status filter") if label is missing
    expect(screen.getByLabelText("Remove Status filter")).toBeInTheDocument();
  });

  it("renders clear search button when search is active", () => {
     // Setup state to show search
    mockState.taskFilters.search = "test";

    render(<TaskFilters />);

    // Search input should have value. Note: we need to find it by label first!
    const input = screen.getByLabelText("Search tasks");
    expect(input).toHaveValue("test");

    // Clear search button should be visible
    const clearButton = screen.getByLabelText("Clear search");
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(updateTaskFilterMock).toHaveBeenCalledWith("search", "");
  });
});
