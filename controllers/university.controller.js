const University = require("../models/University");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const getUniversities = async (req, res, next) => {
  try {
    const universities = await University.find().sort({ createdAt: -1 });
    return successResponse(
      res,
      200,
      "Universities retrieved successfully",
      universities
    );
  } catch (error) {
    next(error);
  }
};

const getUniversityById = async (req, res, next) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return errorResponse(res, 404, "University not found");
    }
    return successResponse(
      res,
      200,
      "University retrieved successfully",
      university
    );
  } catch (error) {
    next(error);
  }
};

const createUniversity = async (req, res, next) => {
  try {
    const university = await University.create(req.body);
    return successResponse(
      res,
      201,
      "University created successfully",
      university
    );
  } catch (error) {
    next(error);
  }
};

const updateUniversity = async (req, res, next) => {
  try {
    const university = await University.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!university) {
      return errorResponse(res, 404, "University not found");
    }
    return successResponse(
      res,
      200,
      "University updated successfully",
      university
    );
  } catch (error) {
    next(error);
  }
};

const deleteUniversity = async (req, res, next) => {
  try {
    const university = await University.findByIdAndDelete(req.params.id);
    if (!university) {
      return errorResponse(res, 404, "University not found");
    }
    return successResponse(res, 200, "University deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUniversities,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity,
};
