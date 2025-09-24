import { useState, useCallback, useEffect } from 'react';
import { googleCalendar } from '../services/googleCalendar.service';
import { appleCalendar } from '../services/appleCalendar.service';
import type { CalendarIntegration, ExternalCalendarEvent } from '../types/calendar';
import { useToast } from '@/hooks/use-toast';

export const useCalendarIntegrations = () => {
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([]);
  const [externalEvents, setExternalEvents] = useState<ExternalCalendarEvent[]>([]);
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const { toast } = useToast();

  // Initialize calendar services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        await googleCalendar.initialize();
        await appleCalendar.initialize();
      } catch (error) {
        console.error('Failed to initialize calendar services:', error);
      }
    };

    initializeServices();
  }, []);

  // Connect to Google Calendar
  const connectGoogleCalendar = useCallback(async () => {
    setIsLoadingIntegrations(true);
    
    try {
      const isSignedIn = await googleCalendar.signIn();
      
      if (isSignedIn) {
        const calendars = await googleCalendar.getCalendarList();
        setIntegrations(prev => {
          const filteredPrev = prev.filter(int => int.provider !== 'google');
          return [...filteredPrev, ...calendars];
        });
        
        toast({
          title: "Google Calendar Connected",
          description: `Connected to ${calendars.length} Google calendars`,
        });
      }
    } catch (error) {
      console.error('Failed to connect Google Calendar:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Calendar",
        variant: "destructive",
      });
    } finally {
      setIsLoadingIntegrations(false);
    }
  }, [toast]);

  // Disconnect from Google Calendar
  const disconnectGoogleCalendar = useCallback(async () => {
    try {
      await googleCalendar.signOut();
      setIntegrations(prev => prev.filter(int => int.provider !== 'google'));
      setExternalEvents(prev => prev.filter(event => event.provider !== 'google'));
      
      toast({
        title: "Google Calendar Disconnected",
        description: "Successfully disconnected from Google Calendar",
      });
    } catch (error) {
      console.error('Failed to disconnect Google Calendar:', error);
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect from Google Calendar",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Connect to Apple Calendar (placeholder)
  const connectAppleCalendar = useCallback(async () => {
    try {
      if (!appleCalendar.isConfigured()) {
        toast({
          title: "Apple Calendar Not Configured",
          description: "Apple Calendar integration requires server-side configuration",
          variant: "destructive",
        });
        return;
      }

      const calendars = await appleCalendar.getCalendarList();
      setIntegrations(prev => {
        const filteredPrev = prev.filter(int => int.provider !== 'apple');
        return [...filteredPrev, ...calendars];
      });
      
      toast({
        title: "Apple Calendar Connected",
        description: `Connected to ${calendars.length} Apple calendars`,
      });
    } catch (error) {
      console.error('Failed to connect Apple Calendar:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Apple Calendar",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Load events from all connected calendars
  const loadExternalEvents = useCallback(async (startDate?: Date, endDate?: Date) => {
    setIsLoadingEvents(true);
    const allEvents: ExternalCalendarEvent[] = [];

    try {
      // Load Google Calendar events
      const googleIntegrations = integrations.filter(int => 
        int.provider === 'google' && int.enabled && int.syncEnabled
      );
      
      for (const integration of googleIntegrations) {
        try {
          const events = await googleCalendar.getEvents(integration.id, startDate, endDate);
          allEvents.push(...events);
        } catch (error) {
          console.error(`Failed to load events from Google calendar ${integration.id}:`, error);
        }
      }

      // Load Apple Calendar events (if configured)
      const appleIntegrations = integrations.filter(int => 
        int.provider === 'apple' && int.enabled && int.syncEnabled
      );
      
      for (const integration of appleIntegrations) {
        try {
          const events = await appleCalendar.getEvents(integration.id, startDate, endDate);
          allEvents.push(...events);
        } catch (error) {
          console.error(`Failed to load events from Apple calendar ${integration.id}:`, error);
        }
      }

      setExternalEvents(allEvents);
    } catch (error) {
      console.error('Failed to load external events:', error);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [integrations]);

  // Toggle integration enabled status
  const toggleIntegration = useCallback((integrationId: string, enabled: boolean) => {
    setIntegrations(prev => 
      prev.map(int => 
        int.id === integrationId ? { ...int, enabled } : int
      )
    );
  }, []);

  // Toggle sync enabled status
  const toggleSync = useCallback((integrationId: string, syncEnabled: boolean) => {
    setIntegrations(prev => 
      prev.map(int => 
        int.id === integrationId ? { ...int, syncEnabled } : int
      )
    );
  }, []);

  // Sync task to external calendar
  const syncTaskToCalendar = useCallback(async (
    task: any,
    integrationId: string
  ) => {
    const integration = integrations.find(int => int.id === integrationId);
    
    if (!integration) {
      throw new Error('Integration not found');
    }

    try {
      const start = task.dueDate ? new Date(task.dueDate) : new Date();
      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration
      
      if (integration.provider === 'google') {
        await googleCalendar.createEvent(
          integrationId,
          task.title,
          start,
          end,
          task.description,
          !task.dueDate
        );
      } else if (integration.provider === 'apple') {
        await appleCalendar.createEvent(
          integrationId,
          task.title,
          start,
          end,
          task.description,
          !task.dueDate
        );
      }

      toast({
        title: "Task Synced",
        description: `Task synced to ${integration.name}`,
      });
    } catch (error) {
      console.error('Failed to sync task:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync task to calendar",
        variant: "destructive",
      });
    }
  }, [integrations, toast]);

  // Check if Google Calendar is connected
  const isGoogleConnected = googleCalendar.isSignedIn();

  return {
    integrations,
    externalEvents,
    isLoadingIntegrations,
    isLoadingEvents,
    isGoogleConnected,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    connectAppleCalendar,
    loadExternalEvents,
    toggleIntegration,
    toggleSync,
    syncTaskToCalendar,
  };
};