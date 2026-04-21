import mongoose from 'mongoose';
import dotenv from 'dotenv';
import request from 'supertest';

dotenv.config();

// Test 1: MongoDB Connection Test
describe('MongoDB Connection', () => {
  it('should connect to MongoDB successfully', async () => {
    const mongoURI = process.env.MONGODB_URI;
    expect(mongoURI).toBeDefined();

    await mongoose.connect(mongoURI as string);
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
    console.log('✅ MongoDB connected successfully to:', mongoose.connection.host);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});

// Test 2: Environment Variables
describe('Environment Variables', () => {
  it('should have all required environment variables', () => {
    const requiredVars = [
      'PORT',
      'NODE_ENV',
      'MONGODB_URI',
      'JWT_SECRET',
      'JWT_EXPIRES_IN',
      'CLIENT_URL',
    ];

    requiredVars.forEach((varName) => {
      expect(process.env[varName]).toBeDefined();
      console.log(`✅ ${varName} is set`);
    });
  });
});

// Test 3: API Health Check
describe('API Server', () => {
  let app: any;

  beforeAll(async () => {
    // Connect to DB first
    await mongoose.connect(process.env.MONGODB_URI as string);
    // Import app after connecting
    const server = await import('../server');
    app = server.app;
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should respond to health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Server is running');
    console.log('✅ Health check passed');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    console.log('✅ 404 handler works');
  });
});

// Test 4: Auth Flow
describe('Authentication Flow', () => {
  let app: any;
  let authToken: string;
  const testUser = {
    name: 'Test Student',
    email: `test_${Date.now()}@example.com`,
    password: 'testpass123',
  };

  beforeAll(async () => {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }
    const server = await import('../server');
    app = server.app;
  });

  afterAll(async () => {
    // Cleanup test user
    const User = (await import('../models/User')).default;
    await User.deleteOne({ email: testUser.email });
    await mongoose.disconnect();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.email);
    authToken = res.body.data.token;
    console.log('✅ User registration works');
  });

  it('should reject duplicate registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(409);
    console.log('✅ Duplicate registration rejected');
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    authToken = res.body.data.token;
    console.log('✅ Login works');
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    console.log('✅ Wrong password rejected');
  });

  it('should get current user with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(testUser.email);
    console.log('✅ Get current user works');
  });

  it('should reject requests without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    console.log('✅ Unauthorized access rejected');
  });
});

// Test 5: Task CRUD
describe('Task CRUD Operations', () => {
  let app: any;
  let authToken: string;
  let taskId: string;
  const testUser = {
    name: 'Task Tester',
    email: `tasktester_${Date.now()}@example.com`,
    password: 'testpass123',
  };

  beforeAll(async () => {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }
    const server = await import('../server');
    app = server.app;

    // Register and get token
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    authToken = res.body.data.token;
  });

  afterAll(async () => {
    // Cleanup
    const User = (await import('../models/User')).default;
    const Task = (await import('../models/Task')).default;
    const user = await User.findOne({ email: testUser.email });
    if (user) {
      await Task.deleteMany({ userId: user._id });
      await User.deleteOne({ _id: user._id });
    }
    await mongoose.disconnect();
  });

  it('should create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Complete Math Homework',
        subject: 'Mathematics',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        description: 'Chapters 5-7',
        estimatedTime: 60,
        tags: ['homework', 'math'],
      });

    expect(res.status).toBe(201);
    expect(res.body.data.task.title).toBe('Complete Math Homework');
    taskId = res.body.data.task._id;
    console.log('✅ Task creation works');
  });

  it('should get all tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.tasks).toBeInstanceOf(Array);
    expect(res.body.data.pagination).toBeDefined();
    console.log('✅ Get tasks works');
  });

  it('should get a single task', async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.task._id).toBe(taskId);
    console.log('✅ Get single task works');
  });

  it('should update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Updated Math Homework',
        subject: 'Mathematics',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
      });

    expect(res.status).toBe(200);
    expect(res.body.data.task.title).toBe('Updated Math Homework');
    console.log('✅ Task update works');
  });

  it('should toggle task status', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}/toggle`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.task.status).toBe('Completed');
    console.log('✅ Task toggle works');
  });

  it('should duplicate a task', async () => {
    const res = await request(app)
      .post(`/api/tasks/${taskId}/duplicate`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(201);
    expect(res.body.data.task.title).toContain('(Copy)');
    console.log('✅ Task duplication works');
  });

  it('should delete a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    console.log('✅ Task deletion works');
  });
});

// Test 6: Analytics
describe('Analytics Endpoints', () => {
  let app: any;
  let authToken: string;
  const testUser = {
    name: 'Analytics Tester',
    email: `analytics_${Date.now()}@example.com`,
    password: 'testpass123',
  };

  beforeAll(async () => {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }
    const server = await import('../server');
    app = server.app;

    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    authToken = res.body.data.token;
  });

  afterAll(async () => {
    const User = (await import('../models/User')).default;
    await User.deleteOne({ email: testUser.email });
    await mongoose.disconnect();
  });

  it('should get analytics summary', async () => {
    const res = await request(app)
      .get('/api/analytics/summary')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('total');
    expect(res.body.data).toHaveProperty('completed');
    expect(res.body.data).toHaveProperty('pending');
    expect(res.body.data).toHaveProperty('overdue');
    expect(res.body.data).toHaveProperty('completionRate');
    console.log('✅ Analytics summary works');
  });

  it('should get chart data', async () => {
    const res = await request(app)
      .get('/api/analytics/charts')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('weeklyCompleted');
    expect(res.body.data).toHaveProperty('subjectDistribution');
    expect(res.body.data).toHaveProperty('statusDistribution');
    console.log('✅ Analytics charts work');
  });
});
