/**
 * SEED SCRIPT — Creates a demo user with 45+ days of realistic student task data.
 *
 * Test User Credentials:
 *   Email:    demo@taskflow.com
 *   Password: demo123456
 *
 * Run:  npx ts-node src/scripts/seed.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Task from '../models/Task';

dotenv.config();

const DEMO_EMAIL = 'demo@taskflow.com';
const DEMO_PASSWORD = 'demo123456';
const DEMO_NAME = 'Alex Johnson';

// Helper: date offset from today
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10, 0, 0, 0);
  return d;
}
function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(23, 59, 0, 0);
  return d;
}

interface SeedTask {
  title: string;
  description?: string;
  subject: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Completed';
  dueDate: Date;
  estimatedTime?: number;
  tags: string[];
  completedAt?: Date;
  createdAt: Date;
}

const seedTasks: SeedTask[] = [
  // ===== COMPLETED TASKS — spread across 45 days for good analytics =====

  // Week 6 ago (days 42-38)
  { title: 'Linear Algebra Problem Set 1', subject: 'Mathematics', priority: 'High', status: 'Completed', dueDate: daysAgo(42), estimatedTime: 90, tags: ['homework', 'math'], completedAt: daysAgo(43), createdAt: daysAgo(46) },
  { title: 'Read Chapter 1 - Intro to Psychology', subject: 'Psychology', priority: 'Medium', status: 'Completed', dueDate: daysAgo(41), estimatedTime: 45, tags: ['reading'], completedAt: daysAgo(41), createdAt: daysAgo(44) },
  { title: 'Lab Report: Acid-Base Titration', subject: 'Chemistry', priority: 'High', status: 'Completed', dueDate: daysAgo(39), estimatedTime: 120, tags: ['lab', 'report'], completedAt: daysAgo(40), createdAt: daysAgo(45) },

  // Week 5 ago (days 37-31)
  { title: 'Physics: Newton\'s Laws Worksheet', subject: 'Physics', priority: 'Medium', status: 'Completed', dueDate: daysAgo(35), estimatedTime: 60, tags: ['homework', 'physics'], completedAt: daysAgo(35), createdAt: daysAgo(38) },
  { title: 'History Essay Draft — WWI Causes', subject: 'History', priority: 'High', status: 'Completed', dueDate: daysAgo(34), estimatedTime: 180, tags: ['essay', 'draft'], completedAt: daysAgo(34), createdAt: daysAgo(40) },
  { title: 'Calculus Quiz Study Guide', subject: 'Mathematics', priority: 'High', status: 'Completed', dueDate: daysAgo(33), estimatedTime: 90, tags: ['quiz', 'study'], completedAt: daysAgo(33), createdAt: daysAgo(36) },
  { title: 'Psychology: Conditioning Experiments Notes', subject: 'Psychology', priority: 'Low', status: 'Completed', dueDate: daysAgo(32), estimatedTime: 30, tags: ['notes'], completedAt: daysAgo(32), createdAt: daysAgo(35) },

  // Week 4 ago (days 30-24)
  { title: 'Computer Science: Sorting Algorithms Implementation', subject: 'Computer Science', priority: 'High', status: 'Completed', dueDate: daysAgo(28), estimatedTime: 150, tags: ['coding', 'algorithms'], completedAt: daysAgo(29), createdAt: daysAgo(33) },
  { title: 'Chemistry Midterm Review', subject: 'Chemistry', priority: 'High', status: 'Completed', dueDate: daysAgo(27), estimatedTime: 120, tags: ['exam', 'study'], completedAt: daysAgo(27), createdAt: daysAgo(32) },
  { title: 'Biology: Cell Division Diagram', subject: 'Biology', priority: 'Medium', status: 'Completed', dueDate: daysAgo(26), estimatedTime: 45, tags: ['diagram', 'biology'], completedAt: daysAgo(26), createdAt: daysAgo(30) },
  { title: 'English Literature: Hamlet Act 3 Analysis', subject: 'English', priority: 'Medium', status: 'Completed', dueDate: daysAgo(25), estimatedTime: 90, tags: ['essay', 'literature'], completedAt: daysAgo(25), createdAt: daysAgo(29) },
  { title: 'Linear Algebra Problem Set 2', subject: 'Mathematics', priority: 'Medium', status: 'Completed', dueDate: daysAgo(24), estimatedTime: 90, tags: ['homework', 'math'], completedAt: daysAgo(24), createdAt: daysAgo(28) },

  // Week 3 ago (days 23-17)
  { title: 'Physics Lab: Pendulum Experiment', subject: 'Physics', priority: 'High', status: 'Completed', dueDate: daysAgo(21), estimatedTime: 90, tags: ['lab', 'experiment'], completedAt: daysAgo(21), createdAt: daysAgo(25) },
  { title: 'History: Primary Source Analysis', subject: 'History', priority: 'Medium', status: 'Completed', dueDate: daysAgo(20), estimatedTime: 60, tags: ['analysis', 'history'], completedAt: daysAgo(20), createdAt: daysAgo(24) },
  { title: 'CS: Binary Search Tree Implementation', subject: 'Computer Science', priority: 'High', status: 'Completed', dueDate: daysAgo(19), estimatedTime: 120, tags: ['coding', 'data-structures'], completedAt: daysAgo(19), createdAt: daysAgo(23) },
  { title: 'Psychology Research Paper Outline', subject: 'Psychology', priority: 'Medium', status: 'Completed', dueDate: daysAgo(18), estimatedTime: 60, tags: ['research', 'outline'], completedAt: daysAgo(18), createdAt: daysAgo(22) },
  { title: 'Calculus: Integration Techniques Practice', subject: 'Mathematics', priority: 'High', status: 'Completed', dueDate: daysAgo(17), estimatedTime: 75, tags: ['practice', 'calculus'], completedAt: daysAgo(17), createdAt: daysAgo(21) },

  // Week 2 ago (days 16-10)
  { title: 'Chemistry: Organic Reactions Worksheet', subject: 'Chemistry', priority: 'Medium', status: 'Completed', dueDate: daysAgo(14), estimatedTime: 60, tags: ['homework', 'organic'], completedAt: daysAgo(14), createdAt: daysAgo(18) },
  { title: 'Biology: Genetics Problem Set', subject: 'Biology', priority: 'High', status: 'Completed', dueDate: daysAgo(13), estimatedTime: 90, tags: ['homework', 'genetics'], completedAt: daysAgo(13), createdAt: daysAgo(17) },
  { title: 'English: Poetry Anthology Review', subject: 'English', priority: 'Low', status: 'Completed', dueDate: daysAgo(12), estimatedTime: 40, tags: ['reading', 'poetry'], completedAt: daysAgo(12), createdAt: daysAgo(16) },
  { title: 'Physics: Thermodynamics Problem Set', subject: 'Physics', priority: 'High', status: 'Completed', dueDate: daysAgo(11), estimatedTime: 90, tags: ['homework', 'thermo'], completedAt: daysAgo(11), createdAt: daysAgo(15) },
  { title: 'History Essay Final Draft — WWI', subject: 'History', priority: 'High', status: 'Completed', dueDate: daysAgo(10), estimatedTime: 150, tags: ['essay', 'final'], completedAt: daysAgo(10), createdAt: daysAgo(35) },

  // Last week (days 9-3)
  { title: 'CS: Graph Traversal Algorithms', subject: 'Computer Science', priority: 'High', status: 'Completed', dueDate: daysAgo(7), estimatedTime: 120, tags: ['coding', 'graphs'], completedAt: daysAgo(7), createdAt: daysAgo(12) },
  { title: 'Linear Algebra Problem Set 3', subject: 'Mathematics', priority: 'Medium', status: 'Completed', dueDate: daysAgo(6), estimatedTime: 90, tags: ['homework', 'math'], completedAt: daysAgo(6), createdAt: daysAgo(10) },
  { title: 'Psychology: Memory Theories Summary', subject: 'Psychology', priority: 'Low', status: 'Completed', dueDate: daysAgo(5), estimatedTime: 30, tags: ['summary', 'notes'], completedAt: daysAgo(5), createdAt: daysAgo(9) },
  { title: 'Chemistry Lab: Spectroscopy Report', subject: 'Chemistry', priority: 'High', status: 'Completed', dueDate: daysAgo(4), estimatedTime: 120, tags: ['lab', 'report'], completedAt: daysAgo(4), createdAt: daysAgo(8) },
  { title: 'Biology: Ecology Case Study', subject: 'Biology', priority: 'Medium', status: 'Completed', dueDate: daysAgo(3), estimatedTime: 60, tags: ['case-study', 'ecology'], completedAt: daysAgo(3), createdAt: daysAgo(7) },

  // Completed today / yesterday (for streak)
  { title: 'English: Short Story Draft', subject: 'English', priority: 'Medium', status: 'Completed', dueDate: daysAgo(1), estimatedTime: 90, tags: ['writing', 'creative'], completedAt: daysAgo(1), createdAt: daysAgo(5) },
  { title: 'Physics Lecture Notes Review', subject: 'Physics', priority: 'Low', status: 'Completed', dueDate: daysAgo(0), estimatedTime: 30, tags: ['review', 'notes'], completedAt: daysAgo(0), createdAt: daysAgo(2) },

  // ===== OVERDUE TASKS (pending, past due) =====
  { title: 'History: Treaty of Versailles Essay', subject: 'History', priority: 'High', status: 'Pending', dueDate: daysAgo(2), estimatedTime: 120, tags: ['essay', 'overdue'], createdAt: daysAgo(8) },
  { title: 'Chemistry: Equilibrium Calculations', subject: 'Chemistry', priority: 'Medium', status: 'Pending', dueDate: daysAgo(1), estimatedTime: 45, tags: ['homework'], createdAt: daysAgo(5) },

  // ===== DUE TODAY =====
  { title: 'Calculus: Differential Equations HW', subject: 'Mathematics', priority: 'High', status: 'Pending', dueDate: daysFromNow(0), estimatedTime: 90, tags: ['homework', 'calculus'], createdAt: daysAgo(3) },
  { title: 'CS: Database Normalization Quiz Prep', subject: 'Computer Science', priority: 'Medium', status: 'Pending', dueDate: daysFromNow(0), estimatedTime: 60, tags: ['quiz', 'databases'], createdAt: daysAgo(4) },

  // ===== UPCOMING TASKS =====
  { title: 'Psychology Research Paper — First Draft', subject: 'Psychology', priority: 'High', status: 'Pending', dueDate: daysFromNow(1), estimatedTime: 240, tags: ['research', 'paper', 'draft'], createdAt: daysAgo(7) },
  { title: 'Biology: DNA Replication Model', subject: 'Biology', priority: 'Medium', status: 'Pending', dueDate: daysFromNow(2), estimatedTime: 90, tags: ['model', 'biology'], createdAt: daysAgo(3) },
  { title: 'English: Macbeth Comparative Essay', subject: 'English', priority: 'High', status: 'Pending', dueDate: daysFromNow(3), estimatedTime: 150, tags: ['essay', 'shakespeare'], createdAt: daysAgo(5) },
  { title: 'Physics: Wave Optics Lab Report', subject: 'Physics', priority: 'Medium', status: 'Pending', dueDate: daysFromNow(4), estimatedTime: 120, tags: ['lab', 'optics'], createdAt: daysAgo(2) },
  { title: 'History: WWII Timeline Project', subject: 'History', priority: 'Low', status: 'Pending', dueDate: daysFromNow(5), estimatedTime: 60, tags: ['project', 'timeline'], createdAt: daysAgo(4) },
  { title: 'CS: REST API Design Document', subject: 'Computer Science', priority: 'High', status: 'Pending', dueDate: daysFromNow(6), estimatedTime: 180, tags: ['design', 'api'], createdAt: daysAgo(3) },
  { title: 'Linear Algebra Final Exam Study', subject: 'Mathematics', priority: 'High', status: 'Pending', dueDate: daysFromNow(8), estimatedTime: 180, tags: ['exam', 'study', 'final'], createdAt: daysAgo(6) },
  { title: 'Chemistry: Thermodynamics Problem Set', subject: 'Chemistry', priority: 'Medium', status: 'Pending', dueDate: daysFromNow(10), estimatedTime: 75, tags: ['homework', 'thermo'], createdAt: daysAgo(2) },
  { title: 'Psychology Final Presentation Slides', subject: 'Psychology', priority: 'High', status: 'Pending', dueDate: daysFromNow(12), estimatedTime: 120, tags: ['presentation', 'slides'], createdAt: daysAgo(1) },
  { title: 'Biology: Semester Lab Portfolio', subject: 'Biology', priority: 'Low', status: 'Pending', dueDate: daysFromNow(14), estimatedTime: 90, tags: ['portfolio', 'semester'], createdAt: daysAgo(4) },
];

async function seed() {
  console.log('🌱 Starting seed...\n');

  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('✅ MongoDB connected\n');

  // Remove existing demo user + tasks
  const existingUser = await User.findOne({ email: DEMO_EMAIL });
  if (existingUser) {
    await Task.deleteMany({ userId: existingUser._id });
    await User.deleteOne({ _id: existingUser._id });
    console.log('🗑️  Cleaned up existing demo user\n');
  }

  // Create demo user
  const user = await User.create({
    name: DEMO_NAME,
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });
  console.log(`👤 Demo user created:`);
  console.log(`   Email:    ${DEMO_EMAIL}`);
  console.log(`   Password: ${DEMO_PASSWORD}\n`);

  // Create tasks
  const tasksToInsert = seedTasks.map((t) => ({
    userId: user._id,
    title: t.title,
    description: t.description,
    subject: t.subject,
    priority: t.priority,
    status: t.status,
    dueDate: t.dueDate,
    estimatedTime: t.estimatedTime,
    tags: t.tags,
    completedAt: t.completedAt,
    createdAt: t.createdAt,
    updatedAt: t.createdAt,
  }));

  await Task.insertMany(tasksToInsert);

  const completed = seedTasks.filter((t) => t.status === 'Completed').length;
  const pending = seedTasks.filter((t) => t.status === 'Pending').length;

  console.log(`📝 ${seedTasks.length} tasks seeded:`);
  console.log(`   ✅ ${completed} completed (spread across 45 days)`);
  console.log(`   ⏳ ${pending} pending (overdue + today + upcoming)`);
  console.log(`   📚 8 subjects: Math, Physics, Chemistry, Biology, CS, Psychology, History, English`);
  console.log(`   🔥 Active streak: 2 days\n`);
  console.log('🎉 Seed complete! You can now log in and explore.\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
