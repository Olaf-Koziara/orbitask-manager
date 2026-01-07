import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { Label } from "@/features/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import { Separator } from "@/features/shared/components/ui/separator";
import { Switch } from "@/features/shared/components/ui/switch";
import {
  Bell,
  Calendar,
  Download,
  Globe,
  Monitor,
  Moon,
  Sun,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface AccountSettingsProps {
  onExportData: () => void;
  onClearCache: () => void;
}

export function AccountSettings({
  onExportData,
  onClearCache,
}: AccountSettingsProps) {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      browser: true,
      taskReminders: true,
      projectUpdates: false,
      weeklyDigest: true,
    },
    appearance: {
      theme: "system", // 'light', 'dark', 'system'
      language: "en",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
    },
    privacy: {
      profileVisible: true,
      showOnlineStatus: false,
      allowAnalytics: true,
    },
  });

  const handleNotificationChange = (
    key: keyof typeof settings.notifications
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleAppearanceChange = (
    key: keyof typeof settings.appearance,
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value,
      },
    }));
  };

  const handlePrivacyChange = (key: keyof typeof settings.privacy) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key],
      },
    }));
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Label>
              <p className="text-sm text-gray-600">Download all your data</p>
            </div>
            <Button
              variant="outline"
              onClick={onExportData}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>Clear Cache</span>
              </Label>
              <p className="text-sm text-gray-600">
                Clear stored data and reset preferences
              </p>
            </div>
            <Button
              variant="outline"
              onClick={onClearCache}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Notifications */}
      <h3 className="">Coming soon</h3>

      <div className="opacity-50 pointer-events-none">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-600">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={() => handleNotificationChange("email")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Browser Notifications</Label>
                <p className="text-sm text-gray-600">
                  Show desktop notifications
                </p>
              </div>
              <Switch
                checked={settings.notifications.browser}
                onCheckedChange={() => handleNotificationChange("browser")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Task Reminders</Label>
                <p className="text-sm text-gray-600">
                  Get notified about upcoming deadlines
                </p>
              </div>
              <Switch
                checked={settings.notifications.taskReminders}
                onCheckedChange={() =>
                  handleNotificationChange("taskReminders")
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Project Updates</Label>
                <p className="text-sm text-gray-600">
                  Notifications when projects are updated
                </p>
              </div>
              <Switch
                checked={settings.notifications.projectUpdates}
                onCheckedChange={() =>
                  handleNotificationChange("projectUpdates")
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Weekly Digest</Label>
                <p className="text-sm text-gray-600">
                  Weekly summary of your activity
                </p>
              </div>
              <Switch
                checked={settings.notifications.weeklyDigest}
                onCheckedChange={() => handleNotificationChange("weeklyDigest")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getThemeIcon(settings.appearance.theme)}
              <span>Appearance & Language</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Theme</Label>
                <p className="text-sm text-gray-600">
                  Choose your preferred theme
                </p>
              </div>
              <Select
                value={settings.appearance.theme}
                onValueChange={(value) =>
                  handleAppearanceChange("theme", value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Language</span>
                </Label>
                <p className="text-sm text-gray-600">
                  Select your preferred language
                </p>
              </div>
              <Select
                value={settings.appearance.language}
                onValueChange={(value) =>
                  handleAppearanceChange("language", value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Date Format</span>
                </Label>
                <p className="text-sm text-gray-600">How dates are displayed</p>
              </div>
              <Select
                value={settings.appearance.dateFormat}
                onValueChange={(value) =>
                  handleAppearanceChange("dateFormat", value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Time Format</Label>
                <p className="text-sm text-gray-600">
                  12-hour or 24-hour format
                </p>
              </div>
              <Select
                value={settings.appearance.timeFormat}
                onValueChange={(value) =>
                  handleAppearanceChange("timeFormat", value)
                }
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12h</SelectItem>
                  <SelectItem value="24h">24h</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Badge variant="secondary" className="w-fit">
                Privacy
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Profile Visibility</Label>
                <p className="text-sm text-gray-600">
                  Allow others to see your profile
                </p>
              </div>
              <Switch
                checked={settings.privacy.profileVisible}
                onCheckedChange={() => handlePrivacyChange("profileVisible")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Show Online Status</Label>
                <p className="text-sm text-gray-600">
                  Let others know when you're online
                </p>
              </div>
              <Switch
                checked={settings.privacy.showOnlineStatus}
                onCheckedChange={() => handlePrivacyChange("showOnlineStatus")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Analytics</Label>
                <p className="text-sm text-gray-600">
                  Help improve the app with usage data
                </p>
              </div>
              <Switch
                checked={settings.privacy.allowAnalytics}
                onCheckedChange={() => handlePrivacyChange("allowAnalytics")}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
    </div>
  );
}
