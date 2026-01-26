import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TaskToolbar } from "../TaskToolbar";
import { TaskRemoveConfirmationDialog } from "../TaskRemoveConfirmationDialog";
import { TooltipProvider } from "@/features/shared/components/ui/tooltip";
import { Task } from "@/features/tasks/types";

// Mock dependencies
vi.mock("@/features/tasks/stores/taskDialog.store", () => ({
  useTaskDialogStore: () => ({
    openDialog: vi.fn(),
  }),
}));

vi.mock("@/features/tasks/hooks/useTasks", () => ({
  useTasks: () => ({
    deleteTask: vi.fn(),
  }),
}));

// Mock Task - providing minimal fields required for components
const mockTask = {
  _id: "task-1",
  title: "Test Task",
  status: "todo",
  priority: "medium",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  position: 0,
  projectId: "project-1",
} as unknown as Task;

describe("Task Accessibility", () => {
  describe("TaskToolbar", () => {
    it("renders the 'More options' button with an accessible name", () => {
      render(
        <TooltipProvider>
          <TaskToolbar task={mockTask} />
        </TooltipProvider>
      );

      const button = screen.getByRole("button", { name: /task options/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe("TaskRemoveConfirmationDialog", () => {
    it("renders the default trigger with accessible name when no trigger is provided", () => {
      render(
        <TooltipProvider>
          <TaskRemoveConfirmationDialog task={mockTask} />
        </TooltipProvider>
      );

      const button = screen.getByRole("button", { name: /delete task/i });
      expect(button).toBeInTheDocument();
    });
  });
});
