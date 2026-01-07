const { verifyToken } = require("../config/jwt");
const User = require("../models/User");
const { errorResponse } = require("../utils/responseHandler");

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    return errorResponse(res, 401, "Not authorized, no token provided");
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return errorResponse(res, 401, "Not authorized, invalid token");
    }

    // Get user from token
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return errorResponse(res, 401, "User not found");
    }

    next();
  } catch (error) {
    return errorResponse(res, 401, "Not authorized, token failed");
  }
};

module.exports = { protect };
