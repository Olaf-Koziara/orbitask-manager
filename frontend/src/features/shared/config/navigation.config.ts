import {
  Filter,
  FolderOpen, type LucideIcon
} from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string | number;
  description?: string;
}

export const navigationItems: readonly NavigationItem[] = [
  {
    id: "kanban",
    label: "Board",
    icon: Filter,
    href: "/kanban",
    description: "Kanban board view for visual task management",
  },
  // {
  //   id: "calendar",
  //   label: "Calendar",
  //   icon: Calendar,
  //   href: "/calendar",
  //   description: "Calendar view for date-based task planning",
  // },
  // {
  //   id: "list",
  //   label: "List",
  //   icon: List,
  //   href: "/list",
  //   description: "List view for detailed task management",
  // },
  {
    id: "projects",
    label: "Projects",
    icon: FolderOpen,
    href: "/projects",
    description: "Manage and organize your projects",
  },
] as const;

export type NavigationItemId = (typeof navigationItems)[number]["id"];

/**
 * Get navigation item by ID
 */
export const getNavigationItem = (id: string): NavigationItem | undefined => {
  return navigationItems.find((item) => item.id === id);
};

/**
 * Check if a given ID is a valid navigation item
 */
export const isValidNavigationId = (id: string): id is NavigationItemId => {
  return navigationItems.some((item) => item.id === id);
};
