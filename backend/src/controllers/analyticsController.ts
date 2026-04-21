import { Response } from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task';
import catchAsync from '../utils/catchAsync';
import { AuthRequest } from '../types/express.d';

// GET /api/analytics/summary
export const getAnalyticsSummary = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [total, completed, pending, overdue] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: 'Completed' }),
      Task.countDocuments({ userId, status: 'Pending' }),
      Task.countDocuments({
        userId,
        status: 'Pending',
        dueDate: { $lt: startOfToday },
      }),
    ]);

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Upcoming deadlines (next 7 days)
    const nextWeek = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcoming = await Task.find({
      userId,
      status: 'Pending',
      dueDate: { $gte: startOfToday, $lte: nextWeek },
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        overdue,
        completionRate,
        upcoming,
      },
    });
  }
);

// GET /api/analytics/charts
export const getAnalyticsCharts = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const now = new Date();

    // Convert string userId to ObjectId for aggregate pipelines
    // (Mongoose auto-casts in find/countDocuments but NOT in aggregate)
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Tasks completed per day this week
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyCompleted = await Task.aggregate([
      {
        $match: {
          userId: userObjectId,
          status: 'Completed',
          completedAt: { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$completedAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = days.map((day, index) => {
      const match = weeklyCompleted.find((w) => w._id === index + 1);
      return { day, completed: match ? match.count : 0 };
    });

    // Subject-wise distribution
    const subjectDistribution = await Task.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Status pie chart data
    const statusDistribution = await Task.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Priority distribution
    const priorityDistribution = await Task.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    // Productivity streak (days with completed tasks)
    const fortyFiveDaysAgo = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);
    const dailyActivity = await Task.aggregate([
      {
        $match: {
          userId: userObjectId,
          status: 'Completed',
          completedAt: { $gte: fortyFiveDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    // Calculate current streak
    let streak = 0;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const activityDates = new Set(dailyActivity.map((d) => d._id));

    for (let i = 0; i < 45; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = checkDate.toISOString().split('T')[0];
      if (activityDates.has(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        weeklyCompleted: weeklyData,
        subjectDistribution: subjectDistribution.map((s) => ({
          subject: s._id,
          count: s.count,
        })),
        statusDistribution: statusDistribution.map((s) => ({
          status: s._id,
          count: s.count,
        })),
        priorityDistribution: priorityDistribution.map((p) => ({
          priority: p._id,
          count: p.count,
        })),
        streak,
        dailyActivity: dailyActivity.map((d) => ({
          date: d._id,
          count: d.count,
        })),
      },
    });
  }
);
