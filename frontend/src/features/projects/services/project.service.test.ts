import { ProjectService } from "@/features/projects/services/project.service";
import { describe, expect, it } from "vitest";

const createMockProject = (overrides = {}) => ({
    _id: "project-1",
    name: "Test Project",
    description: "Test Description",
    color: "#ff6b6b",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-02T00:00:00.000Z",
    createdBy: "user-1",
    members: [],
    ...overrides,
});

describe("ProjectService", () => {
    describe("filterAccessibleProjects", () => {
        it("should filter projects by requested IDs", () => {
            const projects = [
                createMockProject({ _id: "1" }),
                createMockProject({ _id: "2" }),
                createMockProject({ _id: "3" }),
            ] as any;

            const result = ProjectService.filterAccessibleProjects(projects, ["1", "3"]);

            expect(result).toHaveLength(2);
            expect(result.map((p) => p._id)).toEqual(["1", "3"]);
        });

        it("should return all projects when requestedIds is empty", () => {
            const projects = [
                createMockProject({ _id: "1" }),
                createMockProject({ _id: "2" }),
            ] as any;

            const result = ProjectService.filterAccessibleProjects(projects, []);

            expect(result).toHaveLength(2);
        });

        it("should return empty array when no matches", () => {
            const projects = [createMockProject({ _id: "1" })] as any;

            const result = ProjectService.filterAccessibleProjects(projects, ["999"]);

            expect(result).toHaveLength(0);
        });
    });

    describe("generateProjectColor", () => {
        it("should return a valid hex color", () => {
            const color = ProjectService.generateProjectColor();

            expect(color).toMatch(/^#[A-Fa-f0-9]{6}$/);
        });

        it("should return color from predefined list", () => {
            const availableColors = ProjectService.getAvailableColors();
            const color = ProjectService.generateProjectColor();

            expect(availableColors).toContain(color);
        });
    });

    describe("getAvailableColors", () => {
        it("should return array of colors", () => {
            const colors = ProjectService.getAvailableColors();

            expect(Array.isArray(colors)).toBe(true);
            expect(colors.length).toBeGreaterThan(0);
            colors.forEach((color) => {
                expect(color).toMatch(/^#[A-Fa-f0-9]{6}$/);
            });
        });
    });

    describe("validateProjectForm", () => {
        it("should return valid for correct data", () => {
            const result = ProjectService.validateProjectForm({
                name: "Valid Project",
                description: "A valid description",
                color: "#ff6b6b",
            });

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it("should return error for empty name", () => {
            const result = ProjectService.validateProjectForm({ name: "" });
            expect(result.valid).toBe(false);
            expect(result.errors).toContain("Name must be at least 2 characters");
        });

        it("should return error for whitespace-only name", () => {
            const result = ProjectService.validateProjectForm({ name: "   " });
            expect(result.valid).toBe(false);
            expect(result.errors).toContain("Name must be at least 2 characters");
        });

        it("should return error for name too long", () => {
            const result = ProjectService.validateProjectForm({
                name: "A".repeat(51),
            });

            expect(result.valid).toBe(false);
            expect(result.errors).toContain("Name must be 50 characters or less");
        });

        it("should return error for name too short", () => {
            const result = ProjectService.validateProjectForm({ name: "A" });

            expect(result.valid).toBe(false);
            expect(result.errors).toContain("Name must be at least 2 characters");
        });

        it("should return error for description too long", () => {
            const result = ProjectService.validateProjectForm({
                name: "Valid",
                description: "A".repeat(501),
            });

            expect(result.valid).toBe(false);
            expect(result.errors).toContain("Description must be 500 characters or less");
        });

        it("should return error for invalid color", () => {
            const result = ProjectService.validateProjectForm({
                name: "Valid",
                color: "not-a-color",
            });

            expect(result.valid).toBe(false);
            expect(result.errors).toContain("Invalid color format");
        });
    });



    describe("sortProjects", () => {
        const projects = [
            createMockProject({ _id: "1", name: "Zebra", createdAt: "2025-01-01" }),
            createMockProject({ _id: "2", name: "Alpha", createdAt: "2025-03-01" }),
            createMockProject({ _id: "3", name: "Beta", createdAt: "2025-02-01" }),
        ] as any;

        it("should sort by name ascending", () => {
            const result = ProjectService.sortProjects(projects, "name", "asc");

            expect(result[0].name).toBe("Alpha");
            expect(result[1].name).toBe("Beta");
            expect(result[2].name).toBe("Zebra");
        });

        it("should sort by name descending", () => {
            const result = ProjectService.sortProjects(projects, "name", "desc");

            expect(result[0].name).toBe("Zebra");
            expect(result[2].name).toBe("Alpha");
        });

        it("should sort by createdAt descending by default", () => {
            const result = ProjectService.sortProjects(projects);

            expect(result[0].name).toBe("Alpha");
            expect(result[2].name).toBe("Zebra");
        });

        it("should not mutate original array", () => {
            const original = [...projects];
            ProjectService.sortProjects(projects, "name", "asc");

            expect(projects).toEqual(original);
        });
    });

    describe("searchProjects", () => {
        const projects = [
            createMockProject({ name: "Frontend App", description: "React project" }),
            createMockProject({ name: "Backend API", description: "Node server" }),
            createMockProject({ name: "Mobile App", description: "React Native" }),
        ] as any;

        it("should search by name", () => {
            const result = ProjectService.searchProjects(projects, "Frontend");

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe("Frontend App");
        });

        it("should search by description", () => {
            const result = ProjectService.searchProjects(projects, "React");

            expect(result).toHaveLength(2);
        });

        it("should be case insensitive", () => {
            const result = ProjectService.searchProjects(projects, "BACKEND");

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe("Backend API");
        });

        it("should return all when query is empty", () => {
            const result = ProjectService.searchProjects(projects, "");

            expect(result).toHaveLength(3);
        });

        it("should return all when query is whitespace", () => {
            const result = ProjectService.searchProjects(projects, "   ");

            expect(result).toHaveLength(3);
        });
    });

    describe("getProjectById", () => {
        const projects = [
            createMockProject({ _id: "1", name: "Project One" }),
            createMockProject({ _id: "2", name: "Project Two" }),
        ] as any;

        it("should find project by id", () => {
            const result = ProjectService.getProjectById(projects, "2");

            expect(result?.name).toBe("Project Two");
        });

        it("should return undefined when not found", () => {
            const result = ProjectService.getProjectById(projects, "999");

            expect(result).toBeUndefined();
        });
    });
});
