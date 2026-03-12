
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TaskModel } from '../src/models/task.model';
import { User } from '../src/models/user.model';
import { Project } from '../src/models/project.model';

// Mock data generators
const priorities = ['urgent', 'high', 'medium', 'low'];
const statuses = ['todo', 'in-progress', 'review', 'done'];

async function seedData(count: number) {
  console.log(`Seeding ${count} tasks...`);

  // Create a user and project
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'admin'
  });

  const project = await Project.create({
    name: 'Test Project',
    color: '#000000',
    createdBy: user._id
  });

  const tasks = [];
  for (let i = 0; i < count; i++) {
    tasks.push({
      title: `Task ${i}`,
      description: `Description for task ${i}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      createdBy: user._id,
      projectId: project._id,
      assignee: user._id,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000)),
    });
  }

  await TaskModel.insertMany(tasks);
  console.log('Seeding complete.');
  return { userId: user._id, projectId: project._id };
}

async function measureLegacySort() {
  const start = process.hrtime();

  // Simulate the logic from task.router.ts
  const priorityOrder = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const tasks: any[] = await TaskModel.find({})
    .populate([
      { path: "assignee", select: "name email avatarUrl" },
      { path: "createdBy", select: "name email" },
      { path: "project", select: "name color description" },
    ])
    .lean();

  const sortedTasks = tasks.sort((a, b) => {
    const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
    const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
    // Descending
    return priorityB - priorityA;
  });

  const end = process.hrtime(start);
  const timeInMs = (end[0] * 1000 + end[1] / 1e6).toFixed(2);
  return { count: sortedTasks.length, time: timeInMs };
}

async function measureHybridSort() {
  const start = process.hrtime();

  // Optimized aggregation for Sorting ONLY
  const aggregatedTasks = await TaskModel.aggregate([
    { $match: {} },
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
    { $sort: { priorityValue: -1, createdAt: -1 } },
    { $project: { priorityValue: 0 } }
  ]);

  // Efficient Populate using Mongoose
  await TaskModel.populate(aggregatedTasks, [
    { path: "assignee", select: "name email avatarUrl" },
    { path: "createdBy", select: "name email" },
    { path: "project", select: "name color description" },
  ]);

  const end = process.hrtime(start);
  const timeInMs = (end[0] * 1000 + end[1] / 1e6).toFixed(2);
  return { count: aggregatedTasks.length, time: timeInMs };
}

async function runBenchmark() {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  try {
    // Warmup / small dataset
    // await seedData(100);
    // await measureLegacySort();
    // await measureAggregationSort();
    // await TaskModel.deleteMany({});

    // Main Benchmark
    await seedData(10000);

    console.log('Running Legacy Sort...');
    const legacyResult = await measureLegacySort();
    console.log(`Legacy Sort: ${legacyResult.time}ms (${legacyResult.count} tasks)`);

    // Force garbage collection if exposed (usually not in default node, but good practice concept)
    if (global.gc) { global.gc(); }

    console.log('Running Hybrid Sort (Aggregation + Populate)...');
    const aggResult = await measureHybridSort();
    console.log(`Hybrid Sort: ${aggResult.time}ms (${aggResult.count} tasks)`);

    const improvement = parseFloat(legacyResult.time) - parseFloat(aggResult.time);
    const percent = (improvement / parseFloat(legacyResult.time)) * 100;

    console.log('\n--- Results ---');
    console.log(`Improvement: ${improvement.toFixed(2)}ms`);
    console.log(`Speedup: ${percent.toFixed(2)}%`);

  } catch (error) {
    console.error('Benchmark failed:', error);
  } finally {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
}

runBenchmark();
