/**
 * Fees Routes Module
 *
 * This module defines routes for fee management, including:
 * - Recording fee payments
 * - Generating invoices
 * - Sending invoices via WhatsApp
 *
 * All routes in this module are protected and require authentication via JWT token.
 *
 * Base Path: /api/fees
 *
 * @module routes/fees.routes
 */

const express = require("express");
const router = express.Router();

/**
 * Import fees controller functions
 */
const {
  getAllFees, // Retrieve all fee records
  getFeeById, // Retrieve specific fee record
  createFee, // Create new fee payment record
  updateFee, // Update fee record
  deleteFee, // Delete fee record
  downloadInvoice, // Generate and download PDF invoice
  sendInvoiceWhatsApp, // Send invoice via WhatsApp
} = require("../controllers/fees.controller");

/**
 * Import authentication middleware
 */
const { protect } = require("../middleware/auth");

/**
 * Apply authentication middleware to all routes
 */
router.use(protect);

/**
 * Root fees routes (/api/fees)
 *
 * GET  /api/fees - Retrieve all fee records (supports filtering by studentId, status)
 * POST /api/fees - Create a new fee payment record
 */
router.route("/").get(getAllFees).post(createFee);

/**
 * Fee-specific routes (/api/fees/:id)
 *
 * GET    /api/fees/:id - Retrieve a specific fee record
 * PUT    /api/fees/:id - Update a fee record
 * DELETE /api/fees/:id - Delete a fee record
 */
router.route("/:id").get(getFeeById).put(updateFee).delete(deleteFee);

/**
 * GET /api/fees/:id/invoice/download
 * Generate and download fee invoice as PDF
 */
router.get("/:id/invoice/download", downloadInvoice);

/**
 * POST /api/fees/:id/invoice/send
 * Send fee invoice to student via WhatsApp
 * Requires phoneNumber in request body
 */
router.post("/:id/invoice/send", sendInvoiceWhatsApp);

module.exports = router;
