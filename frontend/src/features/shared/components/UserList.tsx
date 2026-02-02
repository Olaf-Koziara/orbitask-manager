import { trpc } from "@/api/trpc";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/features/shared/components/ui/avatar";
import { Badge } from "@/features/shared/components/ui/badge";
import { Checkbox } from "@/features/shared/components/ui/checkbox";
import { ScrollArea } from "@/features/shared/components/ui/scroll-area";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface UserListProps {
  selectedUsers: string[];
  onSelectionChange: (userIds: string[]) => void;
  className?: string;
}

export const UserList = ({
  selectedUsers,
  onSelectionChange,
  className = "",
}: UserListProps) => {
  const { user: currentUser } = useAuthStore();
  const { data: users, isLoading, error } = trpc.auth.list.useQuery();

  const filteredUsers =
    (users as User[] | undefined)?.filter(
      (user) => user._id !== currentUser?.id
    ) || [];

  const handleUserToggle = (userId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedUsers, userId]);
    } else {
      onSelectionChange(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(filteredUsers.map((user) => user._id));
    } else {
      onSelectionChange([]);
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-4 text-red-500 ${className}`}>
        Failed to load users
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className={`text-center py-4 text-gray-500 ${className}`}>
        No other users found
      </div>
    );
  }

  const selectedCount = selectedUsers.length;
  const totalCount = filteredUsers.length;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header with select all */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectedCount === totalCount && totalCount > 0}
            onCheckedChange={handleSelectAll}
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium cursor-pointer"
          >
            Select All ({totalCount})
          </label>
        </div>
        {selectedCount > 0 && (
          <Badge variant="secondary">{selectedCount} selected</Badge>
        )}
      </div>

      {/* User list */}
      <ScrollArea className="h-48 w-full">
        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Checkbox
                id={`user-${user._id}`}
                checked={selectedUsers.includes(user._id)}
                onCheckedChange={(checked) =>
                  handleUserToggle(user._id, checked as boolean)
                }
              />
              <label
                htmlFor={`user-${user._id}`}
                className="flex flex-1 items-center space-x-3 cursor-pointer min-w-0"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
