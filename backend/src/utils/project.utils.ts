import { TRPCError } from "@trpc/server";
import { Types } from "mongoose";
import { Project } from "../models/project.model";

/**
 * Get all project IDs that a user has access to (either as owner or participant)
 */
export async function getAccessibleProjectIds(
  userId: string
): Promise<Types.ObjectId[]> {
  const accessibleProjects = await Project.find({
    $or: [{ createdBy: userId }, { participants: userId }],
  }).select("_id");

  return accessibleProjects.map((p) => p._id);
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

/**
 * Verify user has access to a project and throw appropriate errors if not
 */
export async function verifyProjectAccess(
  projectId: string,
  userId: string,
  userRole?: string,
  customErrorMessage?: string
): Promise<void> {
  const project = await Project.findById(projectId);

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
 * Create a MongoDB query filter for tasks that only includes accessible projects
 */
export async function createTaskProjectFilter(userId: string): Promise<any> {
  const accessibleProjectIds = await getAccessibleProjectIds(userId);
  return { projectId: { $in: accessibleProjectIds } };
}
