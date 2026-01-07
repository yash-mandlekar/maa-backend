/**
 * Staff Routes Module
 *
 * This module defines routes for staff/employee management.
 * Handles CRUD operations for teaching and non-teaching staff members.
 *
 * All routes in this module are protected and require authentication via JWT token.
 *
 * Base Path: /api/staff
 *
 * @module routes/staff.routes
 */

const express = require("express");
const router = express.Router();

/**
 * Import staff controller functions
 */
const {
  getAllStaff, // Retrieve all staff members
  getStaffById, // Retrieve specific staff member
  createStaff, // Add new staff member
  updateStaff, // Update staff information
  deleteStaff, // Remove staff member
} = require("../controllers/staff.controller");

/**
 * Import authentication middleware
 */
const { protect } = require("../middleware/auth");

/**
 * Apply authentication middleware to all routes
 */
router.use(protect);

/**
 * Root staff routes (/api/staff)
 *
 * GET  /api/staff - Retrieve all staff members
 * POST /api/staff - Add a new staff member
 */
router.route("/").get(getAllStaff).post(createStaff);

/**
 * Staff-specific routes (/api/staff/:id)
 *
 * GET    /api/staff/:id - Retrieve a specific staff member
 * PUT    /api/staff/:id - Update staff member information
 * DELETE /api/staff/:id - Remove a staff member
 *
 * URL Parameters:
 * - id: The unique identifier of the staff member (MongoDB ObjectId)
 */
router.route("/:id").get(getStaffById).put(updateStaff).delete(deleteStaff);

module.exports = router;
