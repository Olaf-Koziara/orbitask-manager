
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../src/models/user.model';
import { performance } from 'perf_hooks';

async function runBenchmark() {
  // 1. Setup MongoDB Memory Server
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
  console.log('Connected to in-memory MongoDB');

  // 2. Seed Data
  const USER_COUNT = 10000;
  console.log(`Seeding ${USER_COUNT} users...`);

  const users = [];
  for (let i = 0; i < USER_COUNT; i++) {
    users.push({
      name: `User ${i} - ${Math.random().toString(36).substring(7)}`,
      email: `user${i}@example.com`,
      password: 'password123',
      role: 'member'
    });
  }

  await User.insertMany(users);
  console.log('Seeding complete.');

  // 3. Define the query function (The one we are optimizing)
  // We mirror the logic in backend/src/trpc/auth.router.ts
  const queryFn = async () => {
    return await User.find()
        .select('-password')
        .sort({ name: 1 })
        .lean();
  };

  // 4. Warmup
  console.log('Warming up...');
  await queryFn();

  // 5. Benchmark
  console.log('Running benchmark...');

  const startHeap = process.memoryUsage().heapUsed;
  const startTime = performance.now();

  const results = await queryFn();

  const endTime = performance.now();
  const endHeap = process.memoryUsage().heapUsed;

  const duration = endTime - startTime;
  const heapDiff = endHeap - startHeap;

  console.log('--------------------------------------------------');
  console.log(`Query returned ${results.length} documents.`);
  console.log(`Execution Time: ${duration.toFixed(2)} ms`);
  console.log(`Heap Usage Diff: ${(heapDiff / 1024 / 1024).toFixed(2)} MB`);
  console.log('--------------------------------------------------');

  // 6. Cleanup
  await mongoose.disconnect();
  await mongoServer.stop();
}

runBenchmark().catch(err => {
  console.error(err);
  process.exit(1);
});
