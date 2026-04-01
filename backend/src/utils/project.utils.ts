import { TRPCError } from "@trpc/server";
import { Types } from "mongoose";
import { Project } from "../models/project.model";
import { IProjectDocument } from "../types/project";

/**
 * Get all project IDs that a user has access to (either as owner or participant)
 */
export async function getAccessibleProjectIds(
  userId: string,
  userRole?: string
): Promise<Types.ObjectId[]> {
  const accessibleProjects = await Project.find(
    userRole === "admin"
      ? {}
      : {
          $or: [{ createdBy: userId }, { participants: userId }],
        }
  ).select("_id");

  return accessibleProjects.map((p) => p._id);
}

export async function getProjectOrThrow(projectId: string) {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found",
    });
  }

  return project;
}

/**
 * Check if a user has access to a specific project
 */
export async function hasProjectAccess(
  projectId: string,
  userId: string,
  userRole?: string
): Promise<boolean> {
  // Admin users have access to everything
  if (userRole === "admin") {
    return true;
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return false;
  }

  return (
    project.createdBy.toString() === userId ||
    project.participants.some((p) => p.toString() === userId)
  );
}

export function assertProjectOwnerOrAdmin(
  project: IProjectDocument,
  userId: string,
  userRole?: string,
  customErrorMessage?: string
) {
  if (userRole === "admin" || project.createdBy.toString() === userId) {
    return;
  }

  throw new TRPCError({
    code: "FORBIDDEN",
    message:
      customErrorMessage ||
      "You do not have permission to modify this project",
  });
}

export async function getAccessibleProjectOrThrow(
  projectId: string,
  userId: string,
  userRole?: string
) {
  const project = await getProjectOrThrow(projectId);

  if (
    userRole !== "admin" &&
    project.createdBy.toString() !== userId &&
    !project.participants.some((participant) => participant.toString() === userId)
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to access this project",
    });
  }

  return project;
}

/**
 * Verify user has access to a project and throw appropriate errors if not
 */
export async function verifyProjectAccess(
  projectId: string,
  userId: string,
  userRole?: string,
  customErrorMessage?: string
): Promise<void> {
  const project = await Project.findById(projectId).select(
    "createdBy participants"
  );

  if (!project) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found",
    });
  }

  const hasAccess =
    userRole === "admin" ||
    project.createdBy.toString() === userId ||
    project.participants.some((p) => p.toString() === userId);

  if (!hasAccess) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message:
        customErrorMessage ||
        "You do not have permission to access this project",
    });
  }
}

/**
 * Creates a filter object for finding tasks within accessible projects
 */
export async function createTaskProjectFilter(userId: string) {
  const accessibleProjectIds = await getAccessibleProjectIds(userId);
  return { projectId: { $in: accessibleProjectIds } };
}
