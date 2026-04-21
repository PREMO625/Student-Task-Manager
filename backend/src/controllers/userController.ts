import { Response } from 'express';
import User from '../models/User';
import Task from '../models/Task';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { AuthRequest } from '../types/express.d';

// PUT /api/users/profile
export const updateProfile = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  }
);

// PUT /api/users/password
export const updatePassword = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?.id).select('+password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  }
);

// DELETE /api/users/account
export const deleteAccount = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    // Delete all user's tasks first
    await Task.deleteMany({ userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account and all associated data deleted successfully',
    });
  }
);
