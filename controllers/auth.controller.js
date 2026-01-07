const User = require("../models/User");
const { generateToken } = require("../config/jwt");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return errorResponse(res, 400, "User already exists");
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || "staff",
    });

    // Generate token
    const token = generateToken(user._id);

    return successResponse(res, 201, "User registered successfully", {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return errorResponse(res, 400, "Please provide email and password");
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return errorResponse(res, 401, "Invalid credentials");
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return errorResponse(res, 401, "Invalid credentials");
    }

    // Generate token
    const token = generateToken(user._id);

    return successResponse(res, 200, "Login successful", {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    return successResponse(res, 200, "User retrieved successfully", {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
