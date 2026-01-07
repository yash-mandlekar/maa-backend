const Admission = require("../models/Admission");
const {
  successResponse,
  errorResponse,
  paginatedResponse,
} = require("../utils/responseHandler");

// @desc    Get all admissions with pagination and search
// @route   GET /api/admissions
// @access  Private
const getAdmissions = async (req, res, next) => {
  try {
    const { name, contactNumber, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (name) {
      query.$or = [
        { firstName: new RegExp(name, "i") },
        { lastName: new RegExp(name, "i") },
      ];
    }

    if (contactNumber) {
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { contactNumber }];
        delete query.$or;
      } else {
        query.contactNumber = contactNumber;
      }
    }

    const [admissions, totalCount] = await Promise.all([
      Admission.find(query)
        .populate("course")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ joiningDate: -1 }),
      Admission.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return paginatedResponse(
      res,
      200,
      "Admissions retrieved successfully",
      admissions,
      {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalCount,
        itemsPerPage: parseInt(limit),
      }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get admission by ID
// @route   GET /api/admissions/:id
// @access  Private
const getAdmissionById = async (req, res, next) => {
  try {
    const admission = await Admission.findById(req.params.id).populate(
      "course"
    );

    if (!admission) {
      return errorResponse(res, 404, "Admission not found");
    }

    return successResponse(
      res,
      200,
      "Admission retrieved successfully",
      admission
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Create new admission
// @route   POST /api/admissions
// @access  Private
const createAdmission = async (req, res, next) => {
  try {
    const admission = await Admission.create(req.body);
    const populatedAdmission = await Admission.findById(admission._id).populate(
      "course"
    );

    return successResponse(
      res,
      201,
      "Admission created successfully",
      populatedAdmission
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update admission
// @route   PUT /api/admissions/:id
// @access  Private
const updateAdmission = async (req, res, next) => {
  try {
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("course");

    if (!admission) {
      return errorResponse(res, 404, "Admission not found");
    }

    return successResponse(
      res,
      200,
      "Admission updated successfully",
      admission
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Delete admission
// @route   DELETE /api/admissions/:id
// @access  Private
const deleteAdmission = async (req, res, next) => {
  try {
    const admission = await Admission.findByIdAndDelete(req.params.id);

    if (!admission) {
      return errorResponse(res, 404, "Admission not found");
    }

    return successResponse(res, 200, "Admission deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdmissions,
  getAdmissionById,
  createAdmission,
  updateAdmission,
  deleteAdmission,
};
