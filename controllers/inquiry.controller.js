const Inquiry = require("../models/Inquiry");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const getInquiries = async (req, res, next) => {
  try {
    const { contactNumber } = req.query;
    let query = {};

    if (contactNumber) {
      query.contactNumber = contactNumber;
    }

    const inquiries = await Inquiry.find(query)
      .populate("course")
      .sort({ createdAt: -1 });
    return successResponse(
      res,
      200,
      "Inquiries retrieved successfully",
      inquiries
    );
  } catch (error) {
    next(error);
  }
};

const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate("course");
    if (!inquiry) {
      return errorResponse(res, 404, "Inquiry not found");
    }
    return successResponse(res, 200, "Inquiry retrieved successfully", inquiry);
  } catch (error) {
    next(error);
  }
};

const createInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    return successResponse(res, 201, "Inquiry created successfully", inquiry);
  } catch (error) {
    next(error);
  }
};

const updateInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("course");
    if (!inquiry) {
      return errorResponse(res, 404, "Inquiry not found");
    }
    return successResponse(res, 200, "Inquiry updated successfully", inquiry);
  } catch (error) {
    next(error);
  }
};

const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return errorResponse(res, 404, "Inquiry not found");
    }
    return successResponse(res, 200, "Inquiry deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

const rejectInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { rejected: true },
      { new: true }
    ).populate("course");
    if (!inquiry) {
      return errorResponse(res, 404, "Inquiry not found");
    }
    return successResponse(res, 200, "Inquiry rejected successfully", inquiry);
  } catch (error) {
    next(error);
  }
};

const acceptInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { registered: true },
      { new: true }
    ).populate("course");
    if (!inquiry) {
      return errorResponse(res, 404, "Inquiry not found");
    }
    return successResponse(res, 200, "Inquiry accepted successfully", inquiry);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInquiries,
  getInquiryById,
  createInquiry,
  updateInquiry,
  deleteInquiry,
  rejectInquiry,
  acceptInquiry,
};
