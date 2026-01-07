/**
 * Dashboard Routes Module
 *
 * This module provides system-wide statistics and analytics.
 * Returns aggregated data about students, admissions, inquiries, fees, courses, and staff.
 *
 * All routes in this module are protected and require authentication via JWT token.
 *
 * Base Path: /api/dashboard
 *
 * @module routes/dashboard.routes
 */

const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboard.controller");
const { protect } = require("../middleware/auth");

/**
 * Apply authentication middleware to all routes
 */
router.use(protect);

/**
 * GET /api/dashboard - Retrieve dashboard statistics
 * Returns comprehensive system statistics including:
 * - Total students, admissions, inquiries
 * - Course counts (diploma and short courses)
 * - Fee statistics (total, collected, pending)
 * - Staff count
 */
router.get("/", getDashboardStats);

module.exports = router;
