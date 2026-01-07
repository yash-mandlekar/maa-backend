/**
 * Authentication Routes Module
 *
 * This module defines all authentication-related routes.
 * Handles user registration, login, and retrieving current user information.
 *
 * Base Path: /api/auth
 *
 * @module routes/auth.routes
 */

const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");

/**
 * Public Authentication Routes
 * These routes do NOT require authentication
 */

/**
 * POST /api/auth/register - Register a new user
 * Creates a new user account (admin or staff role)
 * Returns JWT token upon successful registration
 */
router.post("/register", register);

/**
 * POST /api/auth/login - User login
 * Authenticates user credentials and returns JWT token
 */
router.post("/login", login);

/**
 * Protected Authentication Routes
 * These routes require a valid JWT token
 */

/**
 * GET /api/auth/me - Get current authenticated user
 * Returns the profile information of the currently logged-in user
 */
router.get("/me", protect, getMe);

module.exports = router;
