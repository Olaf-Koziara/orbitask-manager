import { Button } from "@/features/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { Label } from "@/features/shared/components/ui/label";
import { Separator } from "@/features/shared/components/ui/separator";
import { Download, Trash2 } from "lucide-react";

interface AccountSettingsProps {
  onExportData: () => void;
  onClearCache: () => void;
}

export function AccountSettings({
  onExportData,
  onClearCache,
}: AccountSettingsProps) {
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
      {/* Coming Soon */}
      {/* 
        UI components for Notifications, Appearance & Privacy settings are maintained in
        AccountSettingsComingSoon.tsx for future feature implementation.
        To enable: import AccountSettingsComingSoon and replace this placeholder.
      */}
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-gray-600 text-center">
            Notifications, Appearance & Privacy coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
