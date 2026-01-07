/**
 * Course Routes Module
 *
 * This module defines routes for managing both DIPLOMA COURSES and SHORT COURSES.
 *
 * DIPLOMA COURSES:
 * - Long-term degree/diploma programs (e.g., BCA, MCA)
 * - Referenced by Student model
 * - Base path: /api/courses
 *
 * SHORT COURSES:
 * - Short-term certificate courses (e.g., Tally, MS Office)
 * - Referenced by Admission model
 * - Base path: /api/courses/short
 *
 * All routes in this module are protected and require authentication via JWT token.
 *
 * @module routes/course.routes
 */

const express = require("express");
const router = express.Router();

/**
 * Import course controller functions
 */
const {
  getCourses, // Get all diploma courses
  getCourseById, // Get specific diploma course
  createCourse, // Create new diploma course
  updateCourse, // Update diploma course
  deleteCourse, // Delete diploma course
  getShortCourses, // Get all short courses
  getShortCourseById, // Get specific short course
  createShortCourse, // Create new short course
  updateShortCourse, // Update short course
  deleteShortCourse, // Delete short course
} = require("../controllers/course.controller");

/**
 * Import authentication middleware
 */
const { protect } = require("../middleware/auth");

/**
 * Apply authentication middleware to all routes
 */
router.use(protect);

/**
 * SHORT COURSE ROUTES (/api/courses/short)
 * IMPORTANT: These must be defined BEFORE the /:id routes to avoid conflicts
 */

/**
 * GET  /api/courses/short - Retrieve all short courses
 * POST /api/courses/short - Create a new short course
 */
router.route("/short").get(getShortCourses).post(createShortCourse);

/**
 * GET    /api/courses/short/:id - Retrieve a specific short course
 * PUT    /api/courses/short/:id - Update a short course
 * DELETE /api/courses/short/:id - Delete a short course
 */
router
  .route("/short/:id")
  .get(getShortCourseById)
  .put(updateShortCourse)
  .delete(deleteShortCourse);

/**
 * DIPLOMA COURSE ROUTES (/api/courses)
 * Main routes for long-term diploma/degree programs
 */

/**
 * GET  /api/courses - Retrieve all diploma courses
 * POST /api/courses - Create a new diploma course
 */
router.route("/").get(getCourses).post(createCourse);

/**
 * GET    /api/courses/:id - Retrieve a specific diploma course
 * PUT    /api/courses/:id - Update a diploma course
 * DELETE /api/courses/:id - Delete a diploma course
 */
router.route("/:id").get(getCourseById).put(updateCourse).delete(deleteCourse);

module.exports = router;
