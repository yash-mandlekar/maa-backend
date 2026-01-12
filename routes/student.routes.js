/**
 * Student Routes Module
 *
 * This module defines routes for managing DIPLOMA STUDENTS.
 * Students are enrolled in long-term diploma/degree programs (e.g., BCA, MCA).
 * This is different from Admissions, which are for short-term courses.
 *
 * All routes in this module are protected and require authentication via JWT token.
 *
 * Base Path: /api/students
 *
 * @module routes/student.routes
 */

const express = require("express");
const router = express.Router();

/**
 * Import student controller functions
 */
const {
  getStudents, // Retrieve all students with optional filtering
  getStudentById, // Retrieve a specific student by ID
  createStudent, // Create a new student record
  updateStudent, // Update an existing student
  deleteStudent, // Delete a student
  getOverdueStudents, // Get students with overdue fees
  searchStudentsAndAdmissions, // Search students and admissions combined
} = require("../controllers/student.controller");

/**
 * Import authentication middleware
 */
const { protect } = require("../middleware/auth");

/**
 * Apply authentication middleware to all routes
 */
router.use(protect);

/**
 * Root student routes (/api/students)
 *
 * GET  /api/students - Retrieve all students (supports query parameters for filtering)
 * POST /api/students - Create a new student
 *
 * Query parameters for GET:
 * - contactNumber: Filter by contact number
 * - course: Filter by course ID (Course reference)
 * - session: Filter by academic session (e.g., "2023-2024")
 */
router.route("/").get(getStudents).post(createStudent);

/**
 * Search students and admissions route
 *
 * GET /api/students/search - Search students and admissions by name or contact
 *
 * Query parameters:
 * - q: Search query (name or contact number, minimum 2 characters)
 */
router.get("/search", searchStudentsAndAdmissions);

/**
 * Overdue students route
 *
 * GET /api/students/overdue - Retrieve all students with overdue fees
 *
 * Returns students and admissions where:
 * - dueDate is before today
 * - due amount is greater than 0
 */
router.get("/overdue", getOverdueStudents);

/**
 * Student-specific routes (/api/students/:id)
 *
 * GET    /api/students/:id - Retrieve a specific student by ID
 * PUT    /api/students/:id - Update an existing student
 * DELETE /api/students/:id - Delete a student
 *
 * URL Parameters:
 * - id: The unique identifier of the student (MongoDB ObjectId)
 */
router
  .route("/:id")
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;
