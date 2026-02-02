
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TaskModel } from '../src/models/task.model';
import { User } from '../src/models/user.model';
import { Project } from '../src/models/project.model';
import { performance } from 'perf_hooks';
import { TaskStatus, Priority } from '../src/types/task';

// Mock Populate Config from task.router.ts
const TASK_POPULATE = [
  { path: "assignee", select: "name email avatarUrl" },
  { path: "createdBy", select: "name email" },
  { path: "project", select: "name color description" },
];

async function runBenchmark() {
  // 1. Setup MongoDB Memory Server
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
  console.log('Connected to in-memory MongoDB');

  // 2. Seed Data
  console.log('Seeding data...');

  // Create Users
  const users = await User.insertMany(Array.from({ length: 10 }).map((_, i) => ({
    name: `User ${i}`,
    email: `user${i}@example.com`,
    password: 'password123',
    role: 'member'
  })));

  // Create Projects
  const projects = await Project.insertMany(Array.from({ length: 5 }).map((_, i) => ({
    name: `Project ${i}`,
    color: '#000000',
    createdBy: users[0]._id,
    participants: [users[0]._id]
  })));

  // Create Tasks
  const TASK_COUNT = 1000;
  const taskDocs = [];
  for (let i = 0; i < TASK_COUNT; i++) {
    taskDocs.push({
      title: `Task ${i}`,
      description: `Description for task ${i}`,
      status: Object.values(TaskStatus)[i % 4],
      priority: Object.values(Priority)[i % 4],
      assignee: users[i % users.length]._id,
      createdBy: users[0]._id,
      projectId: projects[i % projects.length]._id,
      tags: ['tag1', 'tag2']
    });
  }

  await TaskModel.insertMany(taskDocs);
  console.log(`Seeded ${TASK_COUNT} tasks.`);

  // 3. Define Query Functions

  // Baseline: Fetch All (Unbounded)
  const fetchAll = async () => {
    return await TaskModel.find({ createdBy: users[0]._id }) // Simulate "my accessible tasks" filter roughly
      .populate(TASK_POPULATE)
      .sort({ createdAt: -1 })
      .lean();
  };

  // Optimized: Fetch Page (Paginated)
  const fetchPage = async () => {
    return await TaskModel.find({ createdBy: users[0]._id })
      .populate(TASK_POPULATE)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
  };

  // 4. Warmup
  console.log('Warming up...');
  await fetchAll();

  // 5. Benchmark Fetch All
  console.log('\nRunning "Fetch All" Benchmark...');
  global.gc?.(); // Try to trigger GC if exposed (usually not in standard node without flags, but good intent)
  const startHeapAll = process.memoryUsage().heapUsed;
  const startTimeAll = performance.now();

  const resultsAll = await fetchAll();

  const endTimeAll = performance.now();
  const endHeapAll = process.memoryUsage().heapUsed;

  const durationAll = endTimeAll - startTimeAll;
  const heapDiffAll = endHeapAll - startHeapAll;

  console.log(`Fetched ${resultsAll.length} tasks.`);
  console.log(`Time: ${durationAll.toFixed(2)} ms`);
  console.log(`Heap Diff: ${(heapDiffAll / 1024 / 1024).toFixed(2)} MB`);

  // 6. Benchmark Fetch Page
  console.log('\nRunning "Fetch Page (20)" Benchmark...');
  const startHeapPage = process.memoryUsage().heapUsed;
  const startTimePage = performance.now();

  const resultsPage = await fetchPage();

  const endTimePage = performance.now();
  const endHeapPage = process.memoryUsage().heapUsed;

  const durationPage = endTimePage - startTimePage;
  const heapDiffPage = endHeapPage - startHeapPage;

  console.log(`Fetched ${resultsPage.length} tasks.`);
  console.log(`Time: ${durationPage.toFixed(2)} ms`);
  console.log(`Heap Diff: ${(heapDiffPage / 1024 / 1024).toFixed(2)} MB`);

  // 7. Comparison
  const timeImprovement = ((durationAll - durationPage) / durationAll) * 100;
  console.log(`\nTime Improvement: ${timeImprovement.toFixed(2)}%`);

  // Cleanup
  await mongoose.disconnect();
  await mongoServer.stop();
}

runBenchmark().catch(err => {
  console.error(err);
  process.exit(1);
});
