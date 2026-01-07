const Staff = require("../models/Staff");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const getAllStaff = async (req, res, next) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    return successResponse(res, 200, "Staff retrieved successfully", staff);
  } catch (error) {
    next(error);
  }
};

const getStaffById = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return errorResponse(res, 404, "Staff member not found");
    }
    return successResponse(
      res,
      200,
      "Staff member retrieved successfully",
      staff
    );
  } catch (error) {
    next(error);
  }
};

const createStaff = async (req, res, next) => {
  try {
    const staff = await Staff.create(req.body);
    return successResponse(
      res,
      201,
      "Staff member created successfully",
      staff
    );
  } catch (error) {
    next(error);
  }
};

const updateStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!staff) {
      return errorResponse(res, 404, "Staff member not found");
    }
    return successResponse(
      res,
      200,
      "Staff member updated successfully",
      staff
    );
  } catch (error) {
    next(error);
  }
};

const deleteStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return errorResponse(res, 404, "Staff member not found");
    }
    return successResponse(res, 200, "Staff member deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};
