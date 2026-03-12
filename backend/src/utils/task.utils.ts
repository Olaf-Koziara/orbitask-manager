import { TRPCError } from "@trpc/server";
import { TaskModel } from "../models/task.model";
import { getAccessibleProjectIds, verifyProjectAccess } from "./project.utils";

type TaskAccessSubject = {
	projectId?: { toString(): string } | string | null;
	createdBy: { toString(): string } | string;
	assignee?: { toString(): string } | string | null;
};

export async function createTaskVisibilityFilter(
	userId: string,
	userRole?: string
) {
	if (userRole === "admin") {
		return {};
	}

	const accessibleProjectIds = await getAccessibleProjectIds(userId, userRole);
	const personalTaskCondition = {
		$and: [
			{
				$or: [{ projectId: { $exists: false } }, { projectId: null }],
			},
			{
				$or: [{ createdBy: userId }, { assignee: userId }],
			},
		],
	};

	if (accessibleProjectIds.length === 0) {
		return personalTaskCondition;
	}

	return {
		$or: [{ projectId: { $in: accessibleProjectIds } }, personalTaskCondition],
	};
}

export async function assertTaskAccess(
	task: TaskAccessSubject,
	userId: string,
	userRole?: string,
	customErrorMessage?: string
) {
	if (userRole === "admin") {
		return;
	}

	if (task.projectId) {
		await verifyProjectAccess(
			task.projectId.toString(),
			userId,
			userRole,
			customErrorMessage
		);
		return;
	}

	const isPersonalTaskVisible =
		task.createdBy.toString() === userId ||
		task.assignee?.toString() === userId;

	if (!isPersonalTaskVisible) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: customErrorMessage || "You do not have permission to access this task",
		});
	}
}

export async function getTaskOrThrow(taskId: string) {
	const task = await TaskModel.findById(taskId);

	if (!task) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Task not found",
		});
	}

	return task;
}

