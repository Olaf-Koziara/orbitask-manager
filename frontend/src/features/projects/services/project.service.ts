import { Project, ProjectFormValues } from "../types";

const PROJECT_COLORS = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#ffeaa7",
    "#dfe6e9",
    "#74b9ff",
    "#a29bfe",
    "#fd79a8",
    "#fab1a0",
];

export const ProjectService = {
    filterAccessibleProjects: (
        projects: Project[],
        requestedIds: string[]
    ): Project[] => {
        if (!requestedIds.length) return projects;
        return projects.filter((p) => requestedIds.includes(p._id));
    },

    generateProjectColor: (): string => {
        return PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)];
    },

    getAvailableColors: (): string[] => {
        return [...PROJECT_COLORS];
    },

    validateProjectForm: (
        data: Partial<ProjectFormValues>
    ): { valid: boolean; errors: string[] } => {
        const errors: string[] = [];

        if (!data.name?.trim()) {
            errors.push("Name is required");
        } else if (data.name.length > 50) {
            errors.push("Name must be 50 characters or less");
        } else if (data.name.length < 2) {
            errors.push("Name must be at least 2 characters");
        }

        if (data.description && data.description.length > 500) {
            errors.push("Description must be 500 characters or less");
        }

        if (data.color && !ProjectService.isValidColor(data.color)) {
            errors.push("Invalid color format");
        }

        return { valid: errors.length === 0, errors };
    },

    isValidColor: (color: string): boolean => {
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return hexRegex.test(color);
    },

    sortProjects: (
        projects: Project[],
        sortBy: "name" | "createdAt" | "updatedAt" = "createdAt",
        sortOrder: "asc" | "desc" = "desc"
    ): Project[] => {
        return [...projects].sort((a, b) => {
            let comparison = 0;

            if (sortBy === "name") {
                comparison = a.name.localeCompare(b.name);
            } else {
                const dateA = new Date(a[sortBy] || 0).getTime();
                const dateB = new Date(b[sortBy] || 0).getTime();
                comparison = dateA - dateB;
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });
    },

    searchProjects: (projects: Project[], query: string): Project[] => {
        if (!query.trim()) return projects;
        const lowerQuery = query.toLowerCase();
        return projects.filter(
            (p) =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.description?.toLowerCase().includes(lowerQuery)
        );
    },

    getProjectById: (projects: Project[], id: string): Project | undefined => {
        return projects.find((p) => p._id === id);
    },
};
