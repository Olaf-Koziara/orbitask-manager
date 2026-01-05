import { FilterValues } from "@/features/shared/types";

const DEFAULT_FILTER_VALUES: FilterValues = {
    sortBy: "createdAt",
    sortOrder: "desc",
};

const EXCLUDED_FILTER_FIELDS = ["projectId", "projectIds"];

export const FilterService = {
    countActiveFilters: (
        filters: FilterValues,
        excludedFields: string[] = EXCLUDED_FILTER_FIELDS,
        defaultValues: FilterValues = DEFAULT_FILTER_VALUES
    ): number => {
        return Object.entries(filters).filter(([key, value]) => {
            if (excludedFields.includes(key)) return false;
            if (key in defaultValues && value === defaultValues[key]) return false;
            if (value === undefined || value === null) return false;
            if (typeof value === "string" && value.length === 0) return false;
            if (Array.isArray(value) && value.length === 0) return false;
            return true;
        }).length;
    },

    prepareQueryFilters: <T extends FilterValues>(filters: T): Partial<T> => {
        const query: Partial<T> = {};

        Object.entries(filters).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") return;
            if (Array.isArray(value) && value.length === 0) return;
            (query as Record<string, unknown>)[key] = value;
        });

        return query;
    },

    mergeWithDefaults: <T extends FilterValues>(
        partial: Partial<T>,
        defaults: T
    ): T => ({
        ...defaults,
        ...partial,
    }),

    hasActiveFilters: (
        filters: FilterValues,
        excludedFields: string[] = EXCLUDED_FILTER_FIELDS,
        defaultValues: FilterValues = DEFAULT_FILTER_VALUES
    ): boolean => {
        return FilterService.countActiveFilters(filters, excludedFields, defaultValues) > 0;
    },

    clearFilter: <T extends FilterValues>(
        filters: T,
        key: keyof T
    ): T => ({
        ...filters,
        [key]: undefined,
    }),

    resetFilters: <T extends FilterValues>(defaults: T): T => ({ ...defaults }),
};
