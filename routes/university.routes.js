/**
 * University Routes Module
 *
 * This module defines routes for managing university/institution records.
 * Used to maintain a list of universities that students are affiliated with.
 *
 * All routes in this module are protected and require authentication via JWT token.
 *
 * Base Path: /api/universities
 *
 * @module routes/university.routes
 */

const express = require("express");
const router = express.Router();

/**
 * Import university controller functions
 */
const {
  getUniversities, // Retrieve all universities
  getUniversityById, // Retrieve specific university
  createUniversity, // Add new university
  updateUniversity, // Update university information
  deleteUniversity, // Remove university
} = require("../controllers/university.controller");

/**
 * Import authentication middleware
 */
const { protect } = require("../middleware/auth");

/**
 * Apply authentication middleware to all routes
 */
router.use(protect);

/**
 * Root university routes (/api/universities)
 *
 * GET  /api/universities - Retrieve all universities
 * POST /api/universities - Add a new university
 */
router.route("/").get(getUniversities).post(createUniversity);

/**
 * University-specific routes (/api/universities/:id)
 *
 * GET    /api/universities/:id - Retrieve a specific university
 * PUT    /api/universities/:id - Update university information
 * DELETE /api/universities/:id - Remove a university
 *
 * URL Parameters:
 * - id: The unique identifier of the university (MongoDB ObjectId)
 */
router
  .route("/:id")
  .get(getUniversityById)
  .put(updateUniversity)
  .delete(deleteUniversity);

module.exports = router;
