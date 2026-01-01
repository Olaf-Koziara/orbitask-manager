import { describe, it, expect } from "vitest";
import { FilterService } from "./filter.service";

describe("FilterService", () => {
    describe("countActiveFilters", () => {
        it("should count non-empty filters", () => {
            const filters = {
                status: "todo",
                priority: "high",
                search: "",
                assignee: undefined,
            };

            const count = FilterService.countActiveFilters(filters);

            expect(count).toBe(2);
        });

        it("should exclude specified fields", () => {
            const filters = {
                status: "todo",
                projectId: "123",
                projectIds: ["1", "2"],
            };

            const count = FilterService.countActiveFilters(filters, ["projectId", "projectIds"]);

            expect(count).toBe(1);
        });

        it("should not count default values as active", () => {
            const filters = {
                status: "todo",
                sortBy: "createdAt",
                sortOrder: "desc",
            };

            const count = FilterService.countActiveFilters(
                filters,
                [],
                { sortBy: "createdAt", sortOrder: "desc" }
            );

            expect(count).toBe(1);
        });

        it("should return 0 for empty filters", () => {
            const filters = {
                status: undefined,
                priority: null,
                search: "",
                tags: [],
            };

            expect(FilterService.countActiveFilters(filters)).toBe(0);
        });

        it("should count non-empty arrays", () => {
            const filters = {
                tags: ["bug", "urgent"],
                emptyTags: [],
            };

            expect(FilterService.countActiveFilters(filters)).toBe(1);
        });
    });

    describe("prepareQueryFilters", () => {
        it("should remove undefined and null values", () => {
            const filters = {
                status: "todo",
                priority: undefined,
                search: null,
                assignee: "user-1",
            };

            const result = FilterService.prepareQueryFilters(filters);

            expect(result).toEqual({
                status: "todo",
                assignee: "user-1",
            });
        });

        it("should remove empty strings", () => {
            const filters = {
                status: "todo",
                search: "",
            };

            const result = FilterService.prepareQueryFilters(filters);

            expect(result).toEqual({ status: "todo" });
        });

        it("should remove empty arrays", () => {
            const filters = {
                status: "todo",
                tags: [],
                projectIds: ["1", "2"],
            };

            const result = FilterService.prepareQueryFilters(filters);

            expect(result).toEqual({
                status: "todo",
                projectIds: ["1", "2"],
            });
        });

        it("should keep falsy but valid values like 0", () => {
            const filters = {
                count: 0,
                status: "todo",
            };

            const result = FilterService.prepareQueryFilters(filters);

            expect(result).toEqual({ count: 0, status: "todo" });
        });
    });

    describe("mergeWithDefaults", () => {
        it("should merge partial filters with defaults", () => {
            const defaults = {
                status: undefined,
                sortBy: "createdAt",
                sortOrder: "desc",
            };
            const partial = { status: "todo" };

            const result = FilterService.mergeWithDefaults(partial, defaults);

            expect(result).toEqual({
                status: "todo",
                sortBy: "createdAt",
                sortOrder: "desc",
            });
        });

        it("should override defaults with partial values", () => {
            const defaults = { sortBy: "createdAt", sortOrder: "desc" };
            const partial = { sortOrder: "asc" };

            const result = FilterService.mergeWithDefaults(partial, defaults);

            expect(result.sortOrder).toBe("asc");
        });
    });

    describe("hasActiveFilters", () => {
        it("should return true when filters are active", () => {
            const filters = { status: "todo" };
            expect(FilterService.hasActiveFilters(filters)).toBe(true);
        });

        it("should return false when no filters are active", () => {
            const filters = { status: undefined, sortBy: "createdAt", sortOrder: "desc" };
            expect(FilterService.hasActiveFilters(filters)).toBe(false);
        });
    });

    describe("clearFilter", () => {
        it("should set specified filter to undefined", () => {
            const filters = { status: "todo", priority: "high" };

            const result = FilterService.clearFilter(filters, "status");

            expect(result.status).toBeUndefined();
            expect(result.priority).toBe("high");
        });

        it("should not mutate original object", () => {
            const filters = { status: "todo" };

            FilterService.clearFilter(filters, "status");

            expect(filters.status).toBe("todo");
        });
    });

    describe("resetFilters", () => {
        it("should return a copy of defaults", () => {
            const defaults = { status: undefined, sortBy: "createdAt" };

            const result = FilterService.resetFilters(defaults);

            expect(result).toEqual(defaults);
            expect(result).not.toBe(defaults);
        });
    });
});
