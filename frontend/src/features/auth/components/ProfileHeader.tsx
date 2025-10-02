import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/features/shared/components/ui/avatar";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Calendar, Mail, User } from "lucide-react";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: string;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return "Recently joined";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive" as const;
      case "moderator":
        return "secondary" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
              alt={user.name}
            />
            <AvatarFallback className="text-lg font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>

            {user.createdAt && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Member since {formatJoinDate(user.createdAt)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
