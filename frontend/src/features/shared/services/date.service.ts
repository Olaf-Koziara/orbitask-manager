type DateInput = Date | string | number;

const toDate = (input: DateInput): Date => {
  if (input instanceof Date) return input;
  return new Date(input);
};

export const DateService = {
  formatShortDate: (date: DateInput, locale: string='en-US'): string => {
    return toDate(date).toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
    });
  },

  formatFullDate: (date: DateInput, locale: string='en-US'): string => {
    return toDate(date).toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  formatWithTime: (date: DateInput, locale: string='en-US'): string => {
    return toDate(date).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  formatISO: (date: DateInput): string => {
    return toDate(date).toISOString();
  },

  getRelativeTime: (date: DateInput): string => {
    const now = new Date();
    const inputDate = toDate(date);
    const diffMs = now.getTime() - inputDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  },

  getDaysUntil: (date: DateInput): number => {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    const targetDate = toDate(date);
    targetDate.setUTCHours(0, 0, 0, 0);
    const diffMs = targetDate.getTime() - now.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  },

  isToday: (date: DateInput): boolean => {
    const inputDate = toDate(date);
    const today = new Date();
    return (
      inputDate.getDate() === today.getDate() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getFullYear() === today.getFullYear()
    );
  },

  isPast: (date: DateInput): boolean => {
    return toDate(date) < new Date();
  },

  isFuture: (date: DateInput): boolean => {
    return toDate(date) > new Date();
  },

  isWithinDays: (date: DateInput, days: number): boolean => {
    const inputDate = toDate(date);
    const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return inputDate <= futureDate && inputDate >= new Date();
  },

  startOfDay: (date: DateInput): Date => {
    const d = new Date(toDate(date));
    d.setHours(0, 0, 0, 0);
    return d;
  },

  endOfDay: (date: DateInput): Date => {
    const d = new Date(toDate(date));
    d.setHours(23, 59, 59, 999);
    return d;
  },
};
