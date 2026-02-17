import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProjectsList } from "./ProjectsList";
import { Project } from "@/features/projects/types";

// Mock the hook
vi.mock("@/features/projects/hooks/useProjects", () => ({
  useProjects: () => ({
    createProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
  }),
}));

// Mock the dialog component
vi.mock("@/features/projects/components/ProjectFormDialog", () => ({
  ProjectFormDialog: ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => (
    open ? (
      <div data-testid="project-form-dialog">
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null
  ),
}));

// Mock ProjectCard
vi.mock("./ProjectCard", () => ({
  ProjectCard: ({ project }: { project: Project }) => (
    <div data-testid="project-card">{project.name}</div>
  ),
}));

describe("ProjectsList", () => {
  const defaultProps = {
    projects: [],
    isLoading: false,
    activeFiltersCount: 0,
    onRefresh: vi.fn(),
    onClearAllFilters: vi.fn(),
  };

  it("should render 'No projects yet' when no projects and no filters", () => {
    render(<ProjectsList {...defaultProps} />);

    expect(screen.getByText(/No projects yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Create your first project to get started/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Project" })).toBeInTheDocument();
  });

  it("should render 'No projects found matching your filters' when filters are active", () => {
    render(<ProjectsList {...defaultProps} activeFiltersCount={1} />);

    expect(screen.getByText(/No projects found matching your filters/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear filters/i)).toBeInTheDocument();
  });

  it("should allow creating a project via 'New Project' button in header even when list is empty", async () => {
    render(<ProjectsList {...defaultProps} />);

    // Click "New Project" button in header
    const newProjectButton = screen.getByRole("button", { name: "New Project" });
    fireEvent.click(newProjectButton);

    expect(screen.getByTestId("project-form-dialog")).toBeInTheDocument();
  });

  it("should allow creating a project via empty state button", async () => {
    render(<ProjectsList {...defaultProps} />);

    // Click "Create Project" button in empty state
    const createProjectButton = screen.getByRole("button", { name: "Create Project" });
    fireEvent.click(createProjectButton);

    expect(screen.getByTestId("project-form-dialog")).toBeInTheDocument();
  });
});
