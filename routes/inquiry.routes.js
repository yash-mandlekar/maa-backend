/**
 * Inquiry Routes Module
 *
 * This module defines all the routes related to inquiry management in the MAA Computer Backend API.
 * It handles CRUD operations for inquiries, as well as specific actions like accepting or rejecting inquiries.
 *
 * All routes in this module are protected and require authentication via JWT token.
 *
 * Base Path: /api/inquiries
 *
 * @module routes/inquiry.routes
 */

const express = require("express");
const router = express.Router();

/**
 * Import inquiry controller functions
 * These functions handle the business logic for inquiry operations
 */
const {
  getInquiries,      // Retrieve all inquiries with optional filtering
  getInquiryById,    // Retrieve a specific inquiry by its ID
  createInquiry,     // Create a new inquiry
  updateInquiry,     // Update an existing inquiry
  deleteInquiry,     // Delete an inquiry
  rejectInquiry,     // Mark an inquiry as rejected
  acceptInquiry,     // Mark an inquiry as accepted
} = require("../controllers/inquiry.controller");

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
 * Root inquiry routes (/api/inquiries)
 *
 * GET  /api/inquiries - Retrieve all inquiries (supports query parameters for filtering)
 * POST /api/inquiries - Create a new inquiry
 *
 * Query parameters for GET:
 * - contactNumber: Filter by contact number
 * - inquiryType: Filter by inquiry type (student, etc.)
 * - status: Filter by inquiry status (pending, accepted, rejected)
 */
router.route("/").get(getInquiries).post(createInquiry);

/**
 * Inquiry-specific routes (/api/inquiries/:id)
 *
 * GET    /api/inquiries/:id - Retrieve a specific inquiry by ID
 * PUT    /api/inquiries/:id - Update an existing inquiry
 * DELETE /api/inquiries/:id - Delete an inquiry
 *
 * URL Parameters:
 * - id: The unique identifier of the inquiry (MongoDB ObjectId)
 */
router
  .route("/:id")
  .get(getInquiryById)
  .put(updateInquiry)
  .delete(deleteInquiry);

/**
 * Inquiry action routes
 *
 * PATCH /api/inquiries/:id/reject - Mark an inquiry as rejected
 * PATCH /api/inquiries/:id/accept - Mark an inquiry as accepted
 *
 * These routes change the status of an inquiry without modifying other fields.
 * They are typically used in workflow processes where inquiries need to be processed.
 */
router.patch("/:id/reject", rejectInquiry);
router.patch("/:id/accept", acceptInquiry);

module.exports = router;
