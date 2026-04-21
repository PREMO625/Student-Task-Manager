/**
 * RESET SCRIPT — Deletes ALL users and tasks from the database.
 *
 * Run:  npx ts-node src/scripts/reset.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Task from '../models/Task';

dotenv.config();

async function reset() {
  console.log('⚠️  Resetting database...\n');

  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('✅ MongoDB connected\n');

  const taskResult = await Task.deleteMany({});
  const userResult = await User.deleteMany({});

  console.log(`🗑️  Deleted ${taskResult.deletedCount} tasks`);
  console.log(`🗑️  Deleted ${userResult.deletedCount} users\n`);
  console.log('✅ Database reset complete.\n');

  await mongoose.disconnect();
  process.exit(0);
}

reset().catch((err) => {
  console.error('❌ Reset failed:', err);
  process.exit(1);
});
