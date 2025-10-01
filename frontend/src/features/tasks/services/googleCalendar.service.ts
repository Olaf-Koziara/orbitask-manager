import type { ExternalCalendarEvent, CalendarIntegration } from '../types/calendar';

interface GoogleCalendarConfig {
  clientId: string;
  apiKey: string;
  discoveryDoc: string;
  scopes: string[];
}

export class GoogleCalendarService {
  private static instance: GoogleCalendarService;
  private gapi: any;
  private isInitialized = false;
  
  private config: GoogleCalendarConfig = {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
    discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    scopes: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events'
  };

  private constructor() {}

  public static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService();
    }
    return GoogleCalendarService.instance;
  }

  /**
   * Initialize Google Calendar API
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (!window.gapi) {
      throw new Error('Google API not loaded. Please include the Google API script.');
    }

    try {
      this.gapi = window.gapi;
      
      await this.gapi.load('client:auth2', async () => {
        await this.gapi.client.init({
          apiKey: this.config.apiKey,
          clientId: this.config.clientId,
          discoveryDocs: [this.config.discoveryDoc],
          scope: this.config.scopes
        });
        
        this.isInitialized = true;
      });
    } catch (error) {
      console.error('Failed to initialize Google Calendar API:', error);
      throw error;
    }
  }

  /**
   * Sign in to Google account
   */
  async signIn(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }
      return authInstance.isSignedIn.get();
    } catch (error) {
      console.error('Google Calendar sign-in failed:', error);
      return false;
    }
  }

  /**
   * Sign out from Google account
   */
  async signOut(): Promise<void> {
    if (!this.isInitialized) return;

    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      if (authInstance.isSignedIn.get()) {
        await authInstance.signOut();
      }
    } catch (error) {
      console.error('Google Calendar sign-out failed:', error);
    }
  }

  /**
   * Check if user is signed in
   */
  isSignedIn(): boolean {
    if (!this.isInitialized) return false;
    
    const authInstance = this.gapi.auth2.getAuthInstance();
    return authInstance.isSignedIn.get();
  }

  /**
   * Get user's calendar list
   */
  async getCalendarList(): Promise<CalendarIntegration[]> {
    if (!this.isSignedIn()) {
      throw new Error('Not signed in to Google Calendar');
    }

    try {
      const response = await this.gapi.client.calendar.calendarList.list();
      
      return response.result.items.map((calendar: any) => ({
        id: calendar.id,
        provider: 'google' as const,
        name: calendar.summary || 'Untitled Calendar',
        enabled: !calendar.hidden,
        syncEnabled: calendar.selected !== false,
      }));
    } catch (error) {
      console.error('Failed to get calendar list:', error);
      throw error;
    }
  }

  /**
   * Get events from Google Calendar
   */
  async getEvents(
    calendarId: string = 'primary',
    timeMin?: Date,
    timeMax?: Date
  ): Promise<ExternalCalendarEvent[]> {
    if (!this.isSignedIn()) {
      throw new Error('Not signed in to Google Calendar');
    }

    try {
      const response = await this.gapi.client.calendar.events.list({
        calendarId,
        timeMin: timeMin?.toISOString() || new Date().toISOString(),
        timeMax: timeMax?.toISOString() || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.result.items.map((event: any) => ({
        id: event.id,
        title: event.summary || 'Untitled Event',
        start: new Date(event.start?.dateTime || event.start?.date),
        end: new Date(event.end?.dateTime || event.end?.date),
        provider: 'google' as const,
        isAllDay: !!event.start?.date, // All-day events use 'date' instead of 'dateTime'
        description: event.description,
      }));
    } catch (error) {
      console.error('Failed to get events:', error);
      throw error;
    }
  }

  /**
   * Create a new event in Google Calendar
   */
  async createEvent(
    calendarId: string,
    title: string,
    start: Date,
    end: Date,
    description?: string,
    isAllDay = false
  ): Promise<string> {
    if (!this.isSignedIn()) {
      throw new Error('Not signed in to Google Calendar');
    }

    try {
      const event = {
        summary: title,
        description,
        start: isAllDay 
          ? { date: start.toISOString().split('T')[0] }
          : { dateTime: start.toISOString() },
        end: isAllDay
          ? { date: end.toISOString().split('T')[0] }
          : { dateTime: end.toISOString() },
      };

      const response = await this.gapi.client.calendar.events.insert({
        calendarId,
        resource: event,
      });

      return response.result.id;
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  }

  /**
   * Update an existing event in Google Calendar
   */
  async updateEvent(
    calendarId: string,
    eventId: string,
    title: string,
    start: Date,
    end: Date,
    description?: string,
    isAllDay = false
  ): Promise<void> {
    if (!this.isSignedIn()) {
      throw new Error('Not signed in to Google Calendar');
    }

    try {
      const event = {
        summary: title,
        description,
        start: isAllDay 
          ? { date: start.toISOString().split('T')[0] }
          : { dateTime: start.toISOString() },
        end: isAllDay
          ? { date: end.toISOString().split('T')[0] }
          : { dateTime: end.toISOString() },
      };

      await this.gapi.client.calendar.events.update({
        calendarId,
        eventId,
        resource: event,
      });
    } catch (error) {
      console.error('Failed to update event:', error);
      throw error;
    }
  }

  /**
   * Delete an event from Google Calendar
   */
  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    if (!this.isSignedIn()) {
      throw new Error('Not signed in to Google Calendar');
    }

    try {
      await this.gapi.client.calendar.events.delete({
        calendarId,
        eventId,
      });
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  }
}

export const googleCalendar = GoogleCalendarService.getInstance();