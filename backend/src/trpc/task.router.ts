import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import { TaskModel } from "../models/task.model";
import {
  createTaskSchema,
  taskQuerySchema,
  updateTaskSchema,
} from "../schemas/task.schema";
import { TaskMongoResponse } from "../types/task";
import {
  getAccessibleProjectIds,
  verifyProjectAccess,
} from "../utils/project.utils";
import {
  assertTaskAccess,
  createTaskVisibilityFilter,
  getTaskOrThrow,
} from "../utils/task.utils";
import { buildSafeSearchRegex } from "../utils/search.utils";
import { eventEmitter } from "./events";
import { protectedProcedure, router } from "./trpc";

const TASK_POPULATE = [
  { path: "assignee", select: "name email avatarUrl" },
  { path: "createdBy", select: "name email" },
  { path: "project", select: "name color description" },
];

export type TaskEvent = {
  type: "create" | "update" | "delete";
  projectId?: string;
  previousProjectId?: string;
  taskId: string;
  createdById?: string;
  assigneeId?: string;
  data?: TaskMongoResponse;
};

const toOptionalString = (value?: string | { toString(): string } | null) =>
  value ? value.toString() : undefined;

export const taskRouter = router({
  create: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ input, ctx }) => {
      if (input.projectId) {
        await verifyProjectAccess(
          input.projectId,
          ctx.user.id,
          ctx.user.role,
          "You do not have permission to create tasks in this project"
        );
      }

      const task = await TaskModel.create({
        ...input,
        createdBy: ctx.user.id,
      });

      const populatedTask = (await TaskModel.findById(task._id)
        .populate(TASK_POPULATE)
        .lean()) as unknown as TaskMongoResponse;

      eventEmitter.emit("taskUpdate", {
        type: "create",
        projectId: toOptionalString(populatedTask.projectId),
        taskId: populatedTask._id.toString(),
        createdById: populatedTask.createdBy._id.toString(),
        assigneeId: toOptionalString(populatedTask.assignee?._id),
        data: populatedTask,
      } as TaskEvent);

      return populatedTask;
    }),

  get: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const task = (await TaskModel.findById(input)
      .populate(TASK_POPULATE)
      .lean()) as TaskMongoResponse;

    if (!task) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Task not found",
      });
    }

    await assertTaskAccess(
      task,
      ctx.user.id,
      ctx.user.role,
      "You do not have permission to view this task"
    );

    return task;
  }),
  list: protectedProcedure
    .input(taskQuerySchema)
    .query(async ({ input, ctx }) => {
      const filters: Record<string, unknown>[] = [];
      const baseVisibilityFilter = await createTaskVisibilityFilter(
        ctx.user.id,
        ctx.user.role
      );
      const searchRegex = buildSafeSearchRegex(input?.search);

      if (Object.keys(baseVisibilityFilter).length > 0) {
        filters.push(baseVisibilityFilter);
      }

      if (input) {
        if (input.status) filters.push({ status: input.status });
        if (input.priority) filters.push({ priority: input.priority });
        if (input.assignee) {
          filters.push({ assignee: input.assignee === "me" ? ctx.user.id : input.assignee });
        }
        if (input.tags?.length) filters.push({ tags: { $in: input.tags } });

        if (input.projectId) {
          await verifyProjectAccess(
            input.projectId,
            ctx.user.id,
            ctx.user.role
          );
          filters.push({ projectId: input.projectId });
        } else if (input.projectIds?.length) {
          const accessibleProjectIds = await getAccessibleProjectIds(
            ctx.user.id,
            ctx.user.role
          );
          const filteredProjectIds = input.projectIds.filter((id) =>
            accessibleProjectIds.some(
              (accessibleId) => accessibleId.toString() === id
            )
          );
          if (filteredProjectIds.length > 0) {
            filters.push({ projectId: { $in: filteredProjectIds } });
          } else {
            return { items: [], nextCursor: undefined };
          }
        }

        if (searchRegex) {
          filters.push({
            $or: [
              { title: { $regex: searchRegex } },
              { description: { $regex: searchRegex } },
            ],
          });
        }
      }

      const baseQuery =
        filters.length === 0
          ? {}
          : filters.length === 1
            ? filters[0]
            : { $and: filters };

      const limit = input?.limit ?? 20;
      const skip = input?.cursor ?? 0;
      const sortBy = input?.sortBy || "createdAt";
      const sortOrder = input?.sortOrder || "desc";
      const sort: Record<string, 1 | -1> = {};
      let tasks: TaskMongoResponse[] = [];
      let nextCursor: number | undefined;

      if (sortBy === "priority") {
        const aggregatedTasks = await TaskModel.aggregate([
          { $match: baseQuery },
          {
            $addFields: {
              priorityValue: {
                $switch: {
                  branches: [
                    { case: { $eq: ["$priority", "urgent"] }, then: 4 },
                    { case: { $eq: ["$priority", "high"] }, then: 3 },
                    { case: { $eq: ["$priority", "medium"] }, then: 2 },
                    { case: { $eq: ["$priority", "low"] }, then: 1 },
                  ],
                  default: 0,
                },
              },
            },
          },
          {
            $sort: {
              priorityValue: sortOrder === "asc" ? 1 : -1,
              createdAt: -1,
            },
          },
          {
            $project: {
              priorityValue: 0,
            },
          },
          { $skip: skip },
          { $limit: limit + 1 },
        ]);

        await TaskModel.populate(aggregatedTasks, TASK_POPULATE);
        tasks = aggregatedTasks as unknown as TaskMongoResponse[];
      } else {
        sort[sortBy] = sortOrder === "asc" ? 1 : -1;
        tasks = (await TaskModel.find(baseQuery)
          .populate(TASK_POPULATE)
          .sort(sort)
          .skip(skip)
          .limit(limit + 1)
          .lean()) as TaskMongoResponse[];
      }

      if (tasks.length > limit) {
        tasks.pop();
        nextCursor = skip + limit;
      }

      return {
        items: tasks,
        nextCursor,
      };
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: updateTaskSchema }))
    .mutation(async ({ input, ctx }) => {
      const task = await getTaskOrThrow(input.id);
      const previousProjectId = toOptionalString(task.projectId);

      await assertTaskAccess(
        task,
        ctx.user.id,
        ctx.user.role,
        task.projectId
          ? "You do not have permission to update tasks in this project"
          : "You do not have permission to update this task"
      );

      if (
        input.data.projectId &&
        input.data.projectId !== previousProjectId
      ) {
        await verifyProjectAccess(
          input.data.projectId,
          ctx.user.id,
          ctx.user.role,
          "You do not have permission to move task to the target project"
        );
      }

      const updatedTask = (await TaskModel.findByIdAndUpdate(
        input.id,
        { ...input.data, updatedAt: new Date() },
        { new: true }
      )
        .populate(TASK_POPULATE)
        .lean()) as unknown as TaskMongoResponse;

      eventEmitter.emit("taskUpdate", {
        type: "update",
        projectId: toOptionalString(updatedTask.projectId),
        previousProjectId,
        taskId: updatedTask._id.toString(),
        createdById: updatedTask.createdBy._id.toString(),
        assigneeId: toOptionalString(updatedTask.assignee?._id),
        data: updatedTask,
      } as TaskEvent);

      return updatedTask;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const task = await getTaskOrThrow(input);

      await assertTaskAccess(
        task,
        ctx.user.id,
        ctx.user.role,
        task.projectId
          ? "You do not have permission to delete tasks in this project"
          : "You do not have permission to delete this task"
      );

      await TaskModel.findByIdAndDelete(input);

      eventEmitter.emit("taskUpdate", {
        type: "delete",
        projectId: toOptionalString(task.projectId),
        previousProjectId: toOptionalString(task.projectId),
        taskId: task._id.toString(),
        createdById: task.createdBy.toString(),
        assigneeId: toOptionalString(task.assignee),
      } as TaskEvent);

      return { success: true };
    }),

  onUpdate: protectedProcedure
    .input(z.object({ projectId: z.string().optional() }))
    .subscription(async ({ input, ctx }) => {
      const accessibleProjectIds = new Set(
        (
          await getAccessibleProjectIds(ctx.user.id, ctx.user.role)
        ).map((id) => id.toString())
      );

      if (input.projectId) {
        await verifyProjectAccess(input.projectId, ctx.user.id, ctx.user.role);
      }

      return observable<TaskEvent>((emit) => {
        const onTaskUpdate = (event: TaskEvent) => {
          if (
            input.projectId &&
            event.projectId !== input.projectId &&
            event.previousProjectId !== input.projectId
          ) {
            return;
          }

          if (ctx.user.role === "admin") {
            emit.next(event);
            return;
          }

          const touchesAccessibleProject = [event.projectId, event.previousProjectId].some(
            (projectId) => projectId && accessibleProjectIds.has(projectId)
          );
          const touchesPersonalTask =
            !event.projectId &&
            !event.previousProjectId &&
            (event.createdById === ctx.user.id || event.assigneeId === ctx.user.id);

          if (touchesAccessibleProject || touchesPersonalTask) {
            emit.next(event);
          }
        };

        eventEmitter.on("taskUpdate", onTaskUpdate);
        return () => {
          eventEmitter.off("taskUpdate", onTaskUpdate);
        };
      });
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const baseQuery = await createTaskVisibilityFilter(ctx.user.id, ctx.user.role);
    const [total, completed, inProgress, overdue] = await Promise.all([
      TaskModel.countDocuments(baseQuery),
      TaskModel.countDocuments({ ...baseQuery, status: "done" }),
      TaskModel.countDocuments({ ...baseQuery, status: "in-progress" }),
      TaskModel.countDocuments({
        ...baseQuery,
        status: { $ne: "done" },
        dueDate: { $lt: new Date() },
      }),
    ]);

    return {
      total,
      completed,
      inProgress,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }),

  getByStatus: protectedProcedure
    .input(z.enum(["todo", "in-progress", "review", "done"]))
    .query(async ({ input, ctx }) => {
      const baseQuery = await createTaskVisibilityFilter(ctx.user.id, ctx.user.role);
      const tasks = (await TaskModel.find({ ...baseQuery, status: input })
        .populate(TASK_POPULATE)
        .sort({ dueDate: 1, createdAt: -1 })
        .lean()) as TaskMongoResponse[];

      return tasks;
    }),
});
