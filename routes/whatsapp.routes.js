/**
 * WhatsApp Routes Module
 *
 * This module defines routes for WhatsApp integration:
 * - Get connection status and QR code
 * - Restart WhatsApp client
 *
 * Base Path: /api/whatsapp
 */

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getQRCode,
  getStatus,
  restartWhatsAppClient,
} = require("../utils/whatsapp");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// Apply authentication middleware
router.use(protect);

/**
 * GET /api/whatsapp/status
 * Get WhatsApp connection status and QR code if available
 */
router.get("/status", (req, res) => {
  try {
    const status = getStatus();
    const qrCode = getQRCode();

    return successResponse(res, 200, "WhatsApp status retrieved", {
      ...status,
      qrCode: qrCode || null,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to get WhatsApp status");
  }
});

/**
 * POST /api/whatsapp/restart
 * Restart WhatsApp client
 */
router.post("/restart", async (req, res) => {
  try {
    await restartWhatsAppClient();
    return successResponse(res, 200, "WhatsApp client restart initiated", {
      message: "Client is restarting. Please wait for QR code.",
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to restart WhatsApp client");
  }
});

module.exports = router;
