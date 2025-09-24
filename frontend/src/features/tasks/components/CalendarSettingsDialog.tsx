import { useState } from 'react';
import { Button } from '@/features/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/shared/components/ui/card';
import { Switch } from '@/features/shared/components/ui/switch';
import { Label } from '@/features/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/shared/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/features/shared/components/ui/dialog';
import { Badge } from '@/features/shared/components/ui/badge';
import { Calendar, Settings, Link, Unlink, RefreshCw } from 'lucide-react';
import { useCalendarIntegrations } from '../hooks/useCalendarIntegrations';
import type { CalendarView, CalendarSettings } from '../types/calendar';
import { cn } from '@/utils/utils';

interface CalendarSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: CalendarSettings;
  onSettingsChange: (settings: CalendarSettings) => void;
}

const CalendarSettingsDialog = ({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: CalendarSettingsDialogProps) => {
  const {
    integrations,
    isLoadingIntegrations,
    isGoogleConnected,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    connectAppleCalendar,
    toggleIntegration,
    toggleSync,
    loadExternalEvents,
  } = useCalendarIntegrations();

  const [localSettings, setLocalSettings] = useState<CalendarSettings>(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onOpenChange(false);
  };

  const updateSetting = <K extends keyof CalendarSettings>(
    key: K,
    value: CalendarSettings[K]
  ) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Calendar Settings
          </DialogTitle>
          <DialogDescription>
            Configure your calendar view preferences and external calendar integrations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* View Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">View Preferences</CardTitle>
              <CardDescription>
                Customize how your calendar is displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default View</Label>
                  <Select
                    value={localSettings.defaultView}
                    onValueChange={(value) => updateSetting('defaultView', value as CalendarView)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="work_week">Work Week</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="agenda">Agenda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>First Day of Week</Label>
                  <Select
                    value={localSettings.firstDayOfWeek.toString()}
                    onValueChange={(value) => updateSetting('firstDayOfWeek', parseInt(value) as 0 | 1)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sunday</SelectItem>
                      <SelectItem value="1">Monday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Select
                    value={localSettings.startTime.toString()}
                    onValueChange={(value) => updateSetting('startTime', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Select
                    value={localSettings.endTime.toString()}
                    onValueChange={(value) => updateSetting('endTime', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Weekends</Label>
                  <div className="text-sm text-muted-foreground">
                    Display Saturday and Sunday in week views
                  </div>
                </div>
                <Switch
                  checked={localSettings.showWeekends}
                  onCheckedChange={(checked) => updateSetting('showWeekends', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Calendar Integrations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Link className="w-5 h-5" />
                Calendar Integrations
              </CardTitle>
              <CardDescription>
                Connect external calendars to sync your events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Google Calendar Integration */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Google Calendar</div>
                    <div className="text-sm text-muted-foreground">
                      {isGoogleConnected 
                        ? `${integrations.filter(i => i.provider === 'google').length} calendars connected`
                        : 'Not connected'
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={isGoogleConnected ? 'default' : 'outline'}>
                    {isGoogleConnected ? 'Connected' : 'Disconnected'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={isGoogleConnected ? disconnectGoogleCalendar : connectGoogleCalendar}
                    disabled={isLoadingIntegrations}
                  >
                    {isGoogleConnected ? (
                      <>
                        <Unlink className="w-4 h-4 mr-1" />
                        Disconnect
                      </>
                    ) : (
                      <>
                        <Link className="w-4 h-4 mr-1" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Apple Calendar Integration */}
              <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gray-500 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Apple Calendar</div>
                    <div className="text-sm text-muted-foreground">
                      Requires server-side configuration
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Coming Soon</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={connectAppleCalendar}
                    disabled={true}
                  >
                    <Link className="w-4 h-4 mr-1" />
                    Connect
                  </Button>
                </div>
              </div>

              {/* Connected Calendars List */}
              {integrations.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Connected Calendars</Label>
                  {integrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-3 h-3 rounded-full",
                            integration.provider === 'google' ? 'bg-blue-500' : 'bg-gray-500'
                          )}
                        />
                        <span className="text-sm">{integration.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Switch
                            size="sm"
                            checked={integration.enabled}
                            onCheckedChange={(checked) => toggleIntegration(integration.id, checked)}
                          />
                          <Label className="text-xs">Show</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <Switch
                            size="sm"
                            checked={integration.syncEnabled}
                            onCheckedChange={(checked) => toggleSync(integration.id, checked)}
                          />
                          <Label className="text-xs">Sync</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadExternalEvents()}
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Sync All Calendars
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { CalendarSettingsDialog };