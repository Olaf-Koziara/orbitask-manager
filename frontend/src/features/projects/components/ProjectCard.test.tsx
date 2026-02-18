import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectCard } from "./ProjectCard";
import { describe, it, expect, vi } from "vitest";
import { Project } from "../types";

// Mock the Tooltip components to avoid Radix UI complexity in tests
vi.mock("@/features/shared/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="tooltip-trigger">{children}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div data-testid="tooltip-content">{children}</div>,
}));

// Mock DateService to avoid timezone issues
vi.mock("@/features/shared/services/date.service", () => ({
  DateService: {
    formatShortDate: () => "Jan 1",
  },
}));

describe("ProjectCard", () => {
  const mockProject = {
    _id: "1",
    name: "Test Project",
    description: "A test project description",
    color: "#ff0000",
    createdAt: new Date("2023-01-01T12:00:00Z"),
    createdBy: {
      name: "John Doe",
    },
    participants: [],
  } as unknown as Project;

  it("renders project details correctly", () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("A test project description")).toBeInTheDocument();
    expect(screen.getByText("Created by: John Doe")).toBeInTheDocument();
    // Check for "Created: Jan 1" (formatShortDate)
    expect(screen.getByText(/Created: Jan 1/)).toBeInTheDocument();
  });

  it("is accessible as a button", () => {
    render(<ProjectCard project={mockProject} />);

    const card = screen.getByRole("button");
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute("tabIndex", "0");
  });

  it("triggers onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("triggers onClick when Enter key is pressed", () => {
    const handleClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={handleClick} />);

    const card = screen.getByRole("button");
    card.focus();
    fireEvent.keyDown(card, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("triggers onClick when Space key is pressed", () => {
    const handleClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={handleClick} />);

    const card = screen.getByRole("button");
    card.focus();
    fireEvent.keyDown(card, { key: " " });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
