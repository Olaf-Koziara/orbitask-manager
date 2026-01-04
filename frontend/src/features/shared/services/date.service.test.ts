import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { DateService } from "@/features/shared/services/date.service";

describe("DateService", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-06-15T12:00:00.000Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("formatShortDate", () => {
        it("should format date as short format", () => {
            const result = DateService.formatShortDate(new Date("2025-06-15"));
            expect(result).toBe("Jun 15");
        });

        it("should handle string input", () => {
            const result = DateService.formatShortDate("2025-12-25");
            expect(result).toBe("Dec 25");
        });

        it("should handle timestamp input", () => {
            const result = DateService.formatShortDate(1750000000000);
            expect(result).toMatch(/\w{3} \d{1,2}/);
        });
    });

    describe("formatFullDate", () => {
        it("should format date with weekday and full date", () => {
            const result = DateService.formatFullDate(new Date("2025-06-15"));
            expect(result).toContain("June");
            expect(result).toContain("15");
            expect(result).toContain("2025");
        });
    });

    describe("formatWithTime", () => {
        it("should include time in format", () => {
            const result = DateService.formatWithTime(new Date("2025-06-15T14:30:00"));
            expect(result).toContain("Jun");
            expect(result).toContain("15");
            expect(result).toContain("2025");
        });
    });

    describe("formatISO", () => {
        it("should return ISO string", () => {
            const date = new Date("2025-06-15T12:00:00.000Z");
            const result = DateService.formatISO(date);
            expect(result).toBe("2025-06-15T12:00:00.000Z");
        });
    });

    describe("getRelativeTime", () => {
        it("should return Today for same day", () => {
            const today = new Date("2025-06-15T10:00:00.000Z");
            expect(DateService.getRelativeTime(today)).toBe("Today");
        });

        it("should return Yesterday for previous day", () => {
            const yesterday = new Date("2025-06-14T12:00:00.000Z");
            expect(DateService.getRelativeTime(yesterday)).toBe("Yesterday");
        });

        it("should return X days ago for recent dates", () => {
            const threeDaysAgo = new Date("2025-06-12T12:00:00.000Z");
            expect(DateService.getRelativeTime(threeDaysAgo)).toBe("3 days ago");
        });

        it("should return weeks ago for older dates", () => {
            const twoWeeksAgo = new Date("2025-06-01T12:00:00.000Z");
            expect(DateService.getRelativeTime(twoWeeksAgo)).toBe("2 weeks ago");
        });

        it("should return months ago for even older dates", () => {
            const twoMonthsAgo = new Date("2025-04-15T12:00:00.000Z");
            expect(DateService.getRelativeTime(twoMonthsAgo)).toBe("2 months ago");
        });
    });

    describe("getDaysUntil", () => {
        it("should return positive days for future date", () => {
            const futureDate = new Date("2025-06-20T12:00:00.000Z");
            expect(DateService.getDaysUntil(futureDate)).toBe(5);
        });

        it("should return negative days for past date", () => {
            const pastDate = new Date("2025-06-10T12:00:00.000Z");
            expect(DateService.getDaysUntil(pastDate)).toBe(-5);
        });

        it("should return 0 for today (calendar day counting)", () => {
            const today = new Date("2025-06-15T23:59:59.000Z");
            expect(DateService.getDaysUntil(today)).toBe(0);
        });
    });

    describe("isToday", () => {
        it("should return true for today", () => {
            const today = new Date("2025-06-15T08:00:00.000Z");
            expect(DateService.isToday(today)).toBe(true);
        });

        it("should return false for other days", () => {
            const yesterday = new Date("2025-06-14T12:00:00.000Z");
            expect(DateService.isToday(yesterday)).toBe(false);
        });
    });

    describe("isPast", () => {
        it("should return true for past dates", () => {
            const past = new Date("2025-06-14T12:00:00.000Z");
            expect(DateService.isPast(past)).toBe(true);
        });

        it("should return false for future dates", () => {
            const future = new Date("2025-06-16T12:00:00.000Z");
            expect(DateService.isPast(future)).toBe(false);
        });
    });

    describe("isFuture", () => {
        it("should return true for future dates", () => {
            const future = new Date("2025-06-16T12:00:00.000Z");
            expect(DateService.isFuture(future)).toBe(true);
        });

        it("should return false for past dates", () => {
            const past = new Date("2025-06-14T12:00:00.000Z");
            expect(DateService.isFuture(past)).toBe(false);
        });
    });

    describe("isWithinDays", () => {
        it("should return true for dates within range", () => {
            const soon = new Date("2025-06-17T12:00:00.000Z");
            expect(DateService.isWithinDays(soon, 3)).toBe(true);
        });

        it("should return false for dates beyond range", () => {
            const later = new Date("2025-06-25T12:00:00.000Z");
            expect(DateService.isWithinDays(later, 3)).toBe(false);
        });

        it("should return false for past dates", () => {
            const past = new Date("2025-06-14T12:00:00.000Z");
            expect(DateService.isWithinDays(past, 3)).toBe(false);
        });
    });

    describe("startOfDay", () => {
        it("should set time to start of day", () => {
            const date = new Date("2025-06-15T14:30:45.123Z");
            const result = DateService.startOfDay(date);

            expect(result.getHours()).toBe(0);
            expect(result.getMinutes()).toBe(0);
            expect(result.getSeconds()).toBe(0);
            expect(result.getMilliseconds()).toBe(0);
        });
    });

    describe("endOfDay", () => {
        it("should set time to end of day", () => {
            const date = new Date("2025-06-15T14:30:45.123Z");
            const result = DateService.endOfDay(date);

            expect(result.getHours()).toBe(23);
            expect(result.getMinutes()).toBe(59);
            expect(result.getSeconds()).toBe(59);
            expect(result.getMilliseconds()).toBe(999);
        });
    });
});
