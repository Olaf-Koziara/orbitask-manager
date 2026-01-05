import { projectFormSchema } from "@/features/projects/schemas/project.schema";
import { FilterValues, RouterInput, RouterOutput } from "@/features/shared/types";
import z from "zod";

export type Project = RouterOutput["projects"]["list"][0];
export type ProjectCreateInput = RouterInput["projects"]["create"];
export type ProjectUpdateInput = RouterInput["projects"]["update"];

// Project filter types
export interface ProjectFilterValues extends FilterValues {
  search?: string;
  createdBy?: string;
  color?: string;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface ProjectFiltersState {
  search: string;
  createdBy: string | "all";
  color: string | "all";
  sortBy: "name" | "createdAt" | "updatedAt";
  sortOrder: "asc" | "desc";
}

export type ProjectFilterConfig = Partial<{
  [K in keyof ProjectFiltersState]: boolean;
}>;
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
