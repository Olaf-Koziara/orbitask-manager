import { useAuth } from "@/features/auth/hooks/useAuth";
import { ProjectsDropdown } from "@/features/projects";
import { DateService } from "@/features/shared/services/date.service";

import { Avatar, AvatarImage } from "@/features/shared/components/ui/avatar";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/features/shared/components/ui/popover";
import { navigationItems } from "@/features/shared/config/navigation.config";
import { useHeader } from "@/features/shared/hooks/useHeader";
import { useMobileMenu } from "@/features/shared/hooks/useMobileMenu";
import { cn } from "@/features/shared/utils";
import {
  useFiltersStore,
  useTaskFilters,
} from "@/features/tasks/stores/filters.store";
import { useTaskDialogStore } from "@/features/tasks/stores/taskDialog.store";
import { Bell, LogOut, Plus, Settings, User, User2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { MobileMenu, MobileMenuTrigger } from "./MobileMenu";

interface HeaderProps {
  onCreateTask?: () => void;
  currentView?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onCreateTask,
  currentView = "kanban",
}) => {
  const { currentUser, notifications, unreadCount, markAsRead, markAllAsRead } =
    useHeader();
  const { signOut } = useAuth();

  const taskFilters = useTaskFilters();
  const { updateTaskFilter } = useFiltersStore();
  const { openDialog } = useTaskDialogStore();

  // Mobile menu hook
  const { isOpen, toggle, close, menuId } = useMobileMenu();

  const handleSignOut = () => {
    signOut();
  };

  const handleSearchChange = (value: string) => {
    updateTaskFilter("search", value || undefined);
  };

  const handleOpenDialog = () => {
    openDialog();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/40 transition-all duration-200">
      <div className="max-w-[1920px] mx-auto flex h-16 justify-between items-center px-4 md:px-8 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary text-white rounded-xl shadow-glow flex items-center justify-center transition-transform hover:scale-105">
             <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground hidden sm:block">
            TaskMaster
          </h1>
        </div>

        <MobileMenuTrigger onToggle={toggle} isOpen={isOpen} />

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
            {navigationItems.map(({ id, label, icon: Icon, href }) => (
              <Link key={id} to={href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "h-8 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                    currentView === id
                      ? "bg-background text-foreground shadow-sm hover:bg-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                  )}
                  size="sm"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <ProjectsDropdown currentView={currentView} />
            </div>

            <Button onClick={handleOpenDialog} size="sm" className="rounded-full px-5 shadow-glow">
              <Plus className="mr-1.5 h-4 w-4" />
              New Task
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 glass-card" align="end">
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    <Badge variant="secondary" className="text-[10px] h-5">
                       {unreadCount} New
                    </Badge>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications?.slice(0, 5).map((notification) => (
                    <div
                      key={notification._id}
                      className={cn(
                        "p-4 border-b border-border/50 hover:bg-muted/50 cursor-pointer transition-colors",
                        !notification.read && "bg-primary/5"
                      )}
                      onClick={() =>
                        handleMarkNotificationAsRead(notification._id)
                      }
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full mt-2 shrink-0",
                            !notification.read ? "bg-primary" : "bg-muted"
                          )}
                        />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {DateService.formatShortDate(
                              notification.createdAt
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!notifications || notifications.length === 0) && (
                     <div className="p-8 text-center text-sm text-muted-foreground">
                        No notifications
                     </div>
                  )}
                </div>
                <div className="p-2 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs h-8"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark All as Read
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 w-10 rounded-full p-0 flex items-center justify-center"
                >
                  <Avatar className="h-8 w-8">
                    {currentUser?.avatarUrl ? (
                      <AvatarImage
                        src={currentUser?.avatarUrl}
                        alt={currentUser?.name || "User"}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User2 className="!h-5 !w-5 m-auto" />
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-card" align="end">
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentUser?.email}
                    </p>
                    <div className="pt-1">
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase tracking-wider font-semibold"
                      >
                        {currentUser?.role || "member"}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem className="p-2 cursor-pointer rounded-lg focus:bg-muted">
                  <Link
                    className="flex items-center w-full"
                    to="/profile"
                  >
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-2 cursor-pointer rounded-lg focus:bg-muted">
                  <Link
                    className="flex items-center w-full"
                    to="/settings"
                  >
                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem className="p-2 cursor-pointer rounded-lg focus:bg-destructive/10 text-destructive focus:text-destructive">
                  <div
                    onClick={handleSignOut}
                    className="flex items-center w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isOpen}
          onClose={close}
          onToggle={toggle}
          menuId={menuId}
          currentView={currentView}
        />
      </div>
    </header>
  );
};
