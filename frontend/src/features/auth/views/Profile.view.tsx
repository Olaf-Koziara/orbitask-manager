import { Button } from "@/features/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/features/shared/components/ui/tabs";
import { ArrowLeft, Settings, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountSettings } from "../components/AccountSettings";
import { DangerZone } from "../components/DangerZone";
import { ProfileForm } from "../components/ProfileForm";
import { ProfileHeader } from "../components/ProfileHeader";
import { useProfileOperations } from "../hooks/useProfileOperations";
import { useAuthStore } from "../stores/auth.store";

interface ProfileViewProps {
  initialTab?: "profile" | "settings" | "security";
}

export function ProfileView({ initialTab = "profile" }: ProfileViewProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<
    "profile" | "settings" | "security"
  >(initialTab);

  const {
    updateProfile,
    changePassword,
    deleteAccount,
    exportData,
    clearCache,
    isLoading,
    error,
  } = useProfileOperations();
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Profile Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            Please log in to view your profile.
          </p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <div /> {/* Spacer for centering */}
      </div>

      {/* Profile Header */}
      <ProfileHeader user={user} />

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "profile" | "settings" | "security")
        }
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileForm
            user={user}
            onUpdateProfile={updateProfile}
            onChangePassword={changePassword}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <AccountSettings
            onExportData={exportData}
            onClearCache={clearCache}
          />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <DangerZone
            onDeleteAccount={deleteAccount}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
