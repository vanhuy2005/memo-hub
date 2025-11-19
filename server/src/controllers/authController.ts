import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../middlewares/auth.middleware";

// Tạo JWT Token
const generateToken = (
  userId: string,
  email: string,
  username: string
): string => {
  const secret = process.env.JWT_SECRET || "default_secret";
  const expiresIn = process.env.JWT_EXPIRE || "7d";
  return jwt.sign({ id: userId, email, username }, secret, {
    expiresIn,
  } as jwt.SignOptions);
};

// @desc    Đăng ký User mới
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, learning_target } = req.body;

    // Validate input
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide username, email and password",
      });
      return;
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      learning_target: learning_target || "",
    });

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.username);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          learning_target: user.learning_target,
          daily_goal: user.daily_goal,
          theme: user.theme,
          language: user.language,
          notifications_enabled: user.notifications_enabled,
          reminder_time: user.reminder_time,
          created_at: user.created_at,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// @desc    Đăng nhập User
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.username);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          learning_target: user.learning_target,
          daily_goal: user.daily_goal,
          theme: user.theme,
          language: user.language,
          notifications_enabled: user.notifications_enabled,
          reminder_time: user.reminder_time,
          created_at: user.created_at,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

// @desc    Lấy thông tin User hiện tại
// @route   GET /api/auth/me
// @access  Private (require JWT)
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          learning_target: user.learning_target,
          daily_goal: user.daily_goal,
          theme: user.theme,
          language: user.language,
          notifications_enabled: user.notifications_enabled,
          reminder_time: user.reminder_time,
          created_at: user.created_at,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error fetching user info",
      error: error.message,
    });
  }
};

// @desc    Cập nhật cài đặt User
// @route   PUT /api/auth/settings
// @access  Private
export const updateSettings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const {
      learning_target,
      daily_goal,
      theme,
      language,
      notifications_enabled,
      reminder_time,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Update fields if provided
    if (learning_target !== undefined) user.learning_target = learning_target;
    if (daily_goal !== undefined) user.daily_goal = daily_goal;
    if (theme !== undefined) user.theme = theme;
    if (language !== undefined) user.language = language;
    if (notifications_enabled !== undefined)
      user.notifications_enabled = notifications_enabled;
    if (reminder_time !== undefined) user.reminder_time = reminder_time;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          learning_target: user.learning_target,
          daily_goal: user.daily_goal,
          theme: user.theme,
          language: user.language,
          notifications_enabled: user.notifications_enabled,
          reminder_time: user.reminder_time,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error updating settings",
      error: error.message,
    });
  }
};

// @desc    Đổi mật khẩu
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Please provide current password and new password",
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error changing password",
      error: error.message,
    });
  }
};
