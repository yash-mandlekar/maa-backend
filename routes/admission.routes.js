/**
 * Admission Routes Module
 *
 * This module defines all routes related to admission management for SHORT COURSES.
 * Admissions are different from Students - they are for short-term courses like Tally, MS Office, etc.
 *
 * All routes in this module are protected and require authentication via JWT token.
 *
 * Base Path: /api/admissions
 *
 * @module routes/admission.routes
 */

const express = require("express");
const router = express.Router();

/**
 * Import admission controller functions
 * These functions handle the business logic for admission operations
 */
const {
  getAdmissions, // Retrieve all admissions with optional filtering
  getAdmissionById, // Retrieve a specific admission by its ID
  createAdmission, // Create a new admission record
  updateAdmission, // Update an existing admission
  deleteAdmission, // Delete an admission record
} = require("../controllers/admission.controller");

/**
 * Import authentication middleware
 * The 'protect' middleware ensures that only authenticated users can access these routes
 */
const { protect } = require("../middleware/auth");

/**
 * Apply authentication middleware to all routes in this router
 * Every route defined below will require a valid JWT token
 */
router.use(protect);

/**
 * Root admission routes (/api/admissions)
 *
 * GET  /api/admissions - Retrieve all admissions (supports query parameters for filtering)
 * POST /api/admissions - Create a new admission
 *
 * Query parameters for GET:
 * - contactNumber: Filter by contact number
 * - course: Filter by course ID (ShortCourse reference)
 */
router.route("/").get(getAdmissions).post(createAdmission);

/**
 * Admission-specific routes (/api/admissions/:id)
 *
 * GET    /api/admissions/:id - Retrieve a specific admission by ID
 * PUT    /api/admissions/:id - Update an existing admission
 * DELETE /api/admissions/:id - Delete an admission
 *
 * URL Parameters:
 * - id: The unique identifier of the admission (MongoDB ObjectId)
 */
router
  .route("/:id")
  .get(getAdmissionById)
  .put(updateAdmission)
  .delete(deleteAdmission);

module.exports = router;
