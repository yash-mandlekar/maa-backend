const Fees = require("../models/Fees");
const Student = require("../models/Student");
const Admission = require("../models/Admission");
const {
  successResponse,
  errorResponse,
  paginatedResponse,
} = require("../utils/responseHandler");
const { buildPDF } = require("../utils/pdfGenerator");
const {
  getWhatsAppClient,
  MessageMedia,
  isWhatsAppReady,
} = require("../utils/whatsapp");
const { WritableStreamBuffer } = require("stream-buffers");

// @desc    Get all fees with filters and pagination
// @route   GET /api/fees
// @access  Private
const getAllFees = async (req, res, next) => {
  try {
    const { startDate, endDate, studentId, page = 1, limit = 10 } = req.query;
    let query = {};

    if (studentId) {
      query.student = studentId;
    }

    if (startDate || endDate) {
      query.payDate = {};
      if (startDate) query.payDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.payDate.$lte = end;
      }
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [fees, total] = await Promise.all([
      Fees.find(query)
        .populate({
          path: "student",
          populate: { path: "course" },
        })
        .sort({ payDate: -1 })
        .skip(skip)
        .limit(limitNum),
      Fees.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return paginatedResponse(res, 200, "Fees retrieved successfully", fees, {
      currentPage: pageNum,
      totalPages,
      totalItems: total,
      itemsPerPage: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get fee by ID
// @route   GET /api/fees/:id
// @access  Private
const getFeeById = async (req, res, next) => {
  try {
    const fee = await Fees.findById(req.params.id).populate({
      path: "student",
      populate: { path: "course" },
    });

    if (!fee) {
      return errorResponse(res, 404, "Fee record not found");
    }

    return successResponse(res, 200, "Fee retrieved successfully", fee);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new fee
// @route   POST /api/fees
// @access  Private
const createFee = async (req, res, next) => {
  try {
    let { student: studentId, studentModelType, payment } = req.body;

    // Check if studentModelType is missing and infer it
    if (!studentModelType && studentId) {
      // Check in Student model first
      if (await Student.exists({ _id: studentId })) {
        studentModelType = "Student";
      }
      // If not found, check in Admission model
      else if (await Admission.exists({ _id: studentId })) {
        studentModelType = "Admission";
      }

      // Update req.body if we found a type
      if (studentModelType) {
        req.body.studentModelType = studentModelType;
      }
    }

    // Create the fee record
    const fee = await Fees.create(req.body);

    // Deduct payment from student's due amount
    if (studentId && studentModelType && payment) {
      const Model = studentModelType === "Student" ? Student : Admission;
      const studentRecord = await Model.findById(studentId);

      if (studentRecord && studentRecord.due !== undefined) {
        const newDue = Math.max(0, (studentRecord.due || 0) - payment);
        await Model.findByIdAndUpdate(studentId, { due: newDue });
      }
    }

    const populatedFee = await Fees.findById(fee._id).populate({
      path: "student",
      populate: { path: "course" },
    });

    return successResponse(res, 201, "Fee created successfully", populatedFee);
  } catch (error) {
    next(error);
  }
};

// @desc    Update fee
// @route   PUT /api/fees/:id
// @access  Private
const updateFee = async (req, res, next) => {
  try {
    const fee = await Fees.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate({
      path: "student",
      populate: { path: "course" },
    });

    if (!fee) {
      return errorResponse(res, 404, "Fee record not found");
    }

    return successResponse(res, 200, "Fee updated successfully", fee);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete fee
// @route   DELETE /api/fees/:id
// @access  Private
const deleteFee = async (req, res, next) => {
  try {
    const fee = await Fees.findByIdAndDelete(req.params.id);

    if (!fee) {
      return errorResponse(res, 404, "Fee record not found");
    }

    return successResponse(res, 200, "Fee deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

// @desc    Download invoice PDF
// @route   GET /api/fees/:id/invoice/download
// @access  Private
const downloadInvoice = async (req, res, next) => {
  try {
    const fee = await Fees.findById(req.params.id).populate({
      path: "student",
      populate: { path: "course" },
    });

    if (!fee) {
      return errorResponse(res, 404, "Fee record not found");
    }

    const student = fee.student;
    if (!student) {
      return errorResponse(res, 404, "Student record not found");
    }

    const { payment, registrationPaymentMode, payDate, feeType } = fee;
    const { firstName, lastName, course, reg_fee, contactNumber, r_no, _id } =
      student;

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment;filename=invoice_${r_no || _id}.pdf`,
    });

    buildPDF(
      (chunk) => res.write(chunk),
      () => res.end(),
      r_no || _id,
      feeType,
      payDate
        ? payDate.toLocaleDateString("en-GB")
        : new Date().toLocaleDateString("en-GB"),
      firstName,
      lastName,
      course?.courseName || "N/A",
      reg_fee,
      payment,
      contactNumber,
      registrationPaymentMode
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Send invoice via WhatsApp
// @route   POST /api/fees/:id/invoice/send
// @access  Private
const sendInvoiceWhatsApp = async (req, res, next) => {
  try {
    if (!isWhatsAppReady()) {
      return errorResponse(res, 503, "WhatsApp service is not ready");
    }

    const fee = await Fees.findById(req.params.id).populate({
      path: "student",
      populate: { path: "course" },
    });

    if (!fee) {
      return errorResponse(res, 404, "Fee record not found");
    }

    const student = fee.student;
    if (!student) {
      return errorResponse(res, 404, "Student record not found");
    }

    // Validate contact number
    if (
      !student.contactNumber ||
      !/^[6-9]\d{9}$/.test(student.contactNumber.toString())
    ) {
      return errorResponse(res, 400, "Invalid Indian phone number");
    }

    const { payment, registrationPaymentMode, payDate, feeType } = fee;
    const { firstName, lastName, course, reg_fee, contactNumber, r_no, _id } =
      student;

    const chatId = `91${contactNumber}@c.us`;
    const bufferStream = new WritableStreamBuffer();

    buildPDF(
      (chunk) => bufferStream.write(chunk),
      async () => {
        try {
          const buffer = bufferStream.getContents();
          if (!buffer) {
            return errorResponse(res, 500, "PDF generation failed");
          }

          const base64 = buffer.toString("base64");
          const media = new MessageMedia(
            "application/pdf",
            base64,
            "invoice.pdf"
          );
          const whatsappClient = getWhatsAppClient();

          await whatsappClient.sendMessage(chatId, media);

          return successResponse(
            res,
            200,
            "Invoice sent successfully via WhatsApp",
            {
              sentTo: contactNumber,
            }
          );
        } catch (error) {
          console.error("WhatsApp Send Error:", error.message);
          return errorResponse(
            res,
            500,
            "Failed to send invoice. Make sure the number is registered on WhatsApp."
          );
        }
      },
      r_no || _id,
      feeType,
      payDate
        ? payDate.toLocaleDateString("en-GB")
        : new Date().toLocaleDateString("en-GB"),
      firstName,
      lastName,
      course?.courseName || "N/A",
      reg_fee,
      payment,
      contactNumber,
      registrationPaymentMode
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFees,
  getFeeById,
  createFee,
  updateFee,
  deleteFee,
  downloadInvoice,
  sendInvoiceWhatsApp,
};
