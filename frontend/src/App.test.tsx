import { render, screen } from "@testing-library/react";
import React from "react";
import { QueryClient } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const connectionState = {
  current: { state: "pending", type: "state", error: null } as {
    state: "idle" | "connecting" | "pending";
    type: "state";
    error: null;
  },
  listeners: new Set<
    (value: {
      state: "idle" | "connecting" | "pending";
      type: "state";
      error: null;
    }) => void
  >(),
  get() {
    return this.current;
  },
  subscribe({
    next,
  }: {
    next: (value: {
      state: "idle" | "connecting" | "pending";
      type: "state";
      error: null;
    }) => void;
  }) {
    this.listeners.add(next);
    return {
      unsubscribe: () => {
        this.listeners.delete(next);
      },
    };
  },
};

vi.mock("@/api/trpc", () => {
  const queryClient = new QueryClient();

  return {
    queryClient,
    trpcClient: {},
    trpc: {
      Provider: ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
      ),
    },
    wsClient: {
      connectionState,
      reconnect: vi.fn(),
    },
  };
});

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    error: null,
    user: {
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
      role: "member",
    },
    token: "token",
    login: vi.fn(),
    register: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock("@/features/shared/hooks/useHeader", () => ({
  useHeader: () => ({
    currentUser: {
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
      avatarUrl: undefined,
    },
    notifications: [],
    unreadCount: 0,
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
  }),
}));

vi.mock("@/features/projects", () => ({
  ProjectsDropdown: () => <div>Projects</div>,
  ProjectList: () => <div>Project List</div>,
}));

vi.mock("@/features/tasks/templates/Tasks.template", () => ({
  default: () => (
    <div data-testid="tasks-template">
      Tasks Template
      <Outlet />
    </div>
  ),
}));

vi.mock("@/features/tasks/views/KanbanView", () => ({
  default: () => <div>Kanban View</div>,
}));

vi.mock("@/features/tasks/views/CalendarView", () => ({
  default: () => <div>Calendar View</div>,
}));

vi.mock("@/features/tasks/views/ListView", () => ({
  default: () => <div>List View</div>,
}));

vi.mock("@/features/auth/views/Login.view", () => ({
  LoginView: () => <div>Login View</div>,
}));

vi.mock("@/features/auth/views/Register.view", () => ({
  RegisterView: () => <div>Register View</div>,
}));

vi.mock("@/features/auth/views/Profile.view", () => ({
  ProfileView: () => <div>Profile View</div>,
}));

vi.mock("@/features/shared/pages/NotFound", () => ({
  default: () => <div>Not Found</div>,
}));

describe("App startup", () => {
  beforeEach(() => {
    window.location.hash = "#/";
    connectionState.current = { state: "pending", type: "state", error: null };
  });

  it("opens the app shell without hitting the error boundary", async () => {
    const { default: App } = await import("@/App");

    render(<App />);

    expect(await screen.findByText("Kanban View")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
    expect(screen.getByText("connected")).toBeInTheDocument();
  });
});
