import { Response } from 'express';
import Task from '../models/Task';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { AuthRequest } from '../types/express.d';

// GET /api/tasks
export const getTasks = catchAsync(async (req: AuthRequest, res: Response) => {
  const {
    status,
    priority,
    subject,
    search,
    sortBy = 'dueDate',
    order = 'asc',
    page = '1',
    limit = '20',
    view,
  } = req.query;

  const filter: any = { userId: req.user?.id };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (subject) filter.subject = subject;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
    ];
  }

  // Smart views
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

  if (view === 'today') {
    filter.dueDate = { $gte: startOfToday, $lt: endOfToday };
    filter.status = 'Pending';
  } else if (view === 'upcoming') {
    filter.dueDate = { $gte: endOfToday };
    filter.status = 'Pending';
  } else if (view === 'overdue') {
    filter.dueDate = { $lt: startOfToday };
    filter.status = 'Pending';
  } else if (view === 'completed') {
    filter.status = 'Completed';
  } else if (view === 'high-priority') {
    filter.priority = 'High';
    filter.status = 'Pending';
  }

  const sortOrder = order === 'desc' ? -1 : 1;
  const sortField = ['dueDate', 'createdAt', 'title', 'priority'].includes(
    sortBy as string
  )
    ? (sortBy as string)
    : 'dueDate';

  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Task.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    },
  });
});

// POST /api/tasks
export const createTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await Task.create({
    ...req.body,
    userId: req.user?.id,
  });

  res.status(201).json({
    success: true,
    data: { task },
  });
});

// GET /api/tasks/:id
export const getTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user?.id,
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.status(200).json({
    success: true,
    data: { task },
  });
});

// PUT /api/tasks/:id
export const updateTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user?.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.status(200).json({
    success: true,
    data: { task },
  });
});

// DELETE /api/tasks/:id
export const deleteTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user?.id,
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
  });
});

// PATCH /api/tasks/:id/toggle
export const toggleTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user?.id,
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  task.status = task.status === 'Pending' ? 'Completed' : 'Pending';
  task.completedAt = task.status === 'Completed' ? new Date() : undefined;
  await task.save();

  res.status(200).json({
    success: true,
    data: { task },
  });
});

// DELETE /api/tasks/bulk
export const bulkDeleteTasks = catchAsync(async (req: AuthRequest, res: Response) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new AppError('Please provide an array of task IDs', 400);
  }

  const result = await Task.deleteMany({
    _id: { $in: ids },
    userId: req.user?.id,
  });

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} tasks deleted successfully`,
  });
});

// POST /api/tasks/:id/duplicate
export const duplicateTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const originalTask = await Task.findOne({
    _id: req.params.id,
    userId: req.user?.id,
  });

  if (!originalTask) {
    throw new AppError('Task not found', 404);
  }

  const duplicate = await Task.create({
    userId: req.user?.id,
    title: `${originalTask.title} (Copy)`,
    description: originalTask.description,
    subject: originalTask.subject,
    priority: originalTask.priority,
    status: 'Pending',
    dueDate: originalTask.dueDate,
    estimatedTime: originalTask.estimatedTime,
    tags: originalTask.tags,
  });

  res.status(201).json({
    success: true,
    data: { task: duplicate },
  });
});
