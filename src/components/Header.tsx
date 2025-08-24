import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Search, 
  Bell, 
  Plus, 
  Settings,
  LogOut,
  User,
  Calendar,
  Filter
} from 'lucide-react';
import { currentUser, mockNotifications } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onCreateTask?: () => void;
  onViewChange?: (view: 'kanban' | 'calendar' | 'list') => void;
  currentView?: 'kanban' | 'calendar' | 'list';
}

export const Header: React.FC<HeaderProps> = ({ 
  onCreateTask, 
  onViewChange,
  currentView = 'kanban'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const viewButtons = [
    { id: 'kanban', label: 'Board', icon: Filter },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'list', label: 'List', icon: User }
  ] as const;

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex h-16 items-center px-6 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TM</span>
          </div>
          <h1 className="text-xl font-bold text-gradient">TaskMaster</h1>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks, projects, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/60"
            />
          </div>
        </div>

        {/* View Toggle */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
          {viewButtons.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={currentView === id ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange?.(id)}
              className="h-8 px-3"
            >
              <Icon className="h-4 w-4 mr-1.5" />
              {label}
            </Button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Create Task */}
          <Button 
            variant="gradient" 
            size="sm"
            onClick={onCreateTask}
            className="hidden sm:flex"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Task
          </Button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  You have {unreadCount} unread notifications
                </p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockNotifications.slice(0, 5).map((notification) => (
                  <div 
                    key={notification.id}
                    className={cn(
                      "p-4 border-b border-border/50 hover:bg-muted/50 cursor-pointer",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-2",
                        !notification.read ? "bg-primary" : "bg-muted"
                      )} />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2">
                <Button variant="ghost" size="sm" className="w-full">
                  View All Notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser.email}
                  </p>
                  <Badge 
                    variant="secondary" 
                    className="w-fit text-xs mt-1 capitalize"
                  >
                    {currentUser.role}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};