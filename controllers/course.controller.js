const Course = require("../models/Course");
const ShortCourse = require("../models/ShortCourse");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// ========== DIPLOMA COURSES ==========

const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    return successResponse(res, 200, "Courses retrieved successfully", courses);
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return errorResponse(res, 404, "Course not found");
    }
    return successResponse(res, 200, "Course retrieved successfully", course);
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    return successResponse(res, 201, "Course created successfully", course);
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return errorResponse(res, 404, "Course not found");
    }
    return successResponse(res, 200, "Course updated successfully", course);
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return errorResponse(res, 404, "Course not found");
    }
    return successResponse(res, 200, "Course deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

// ========== SHORT COURSES ==========

const getShortCourses = async (req, res, next) => {
  try {
    const courses = await ShortCourse.find().sort({ createdAt: -1 });
    return successResponse(
      res,
      200,
      "Short courses retrieved successfully",
      courses
    );
  } catch (error) {
    next(error);
  }
};

const getShortCourseById = async (req, res, next) => {
  console.log("hit");
  
  try {
    const course = await ShortCourse.findById(req.params.id);
    if (!course) {
      return errorResponse(res, 404, "Short course not found");
    }
    return successResponse(
      res,
      200,
      "Short course retrieved successfully",
      course
    );
  } catch (error) {
    next(error);
  }
};

const createShortCourse = async (req, res, next) => {
  try {
    const course = await ShortCourse.create(req.body);
    return successResponse(
      res,
      201,
      "Short course created successfully",
      course
    );
  } catch (error) {
    next(error);
  }
};

const updateShortCourse = async (req, res, next) => {
  try {
    const course = await ShortCourse.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!course) {
      return errorResponse(res, 404, "Short course not found");
    }
    return successResponse(
      res,
      200,
      "Short course updated successfully",
      course
    );
  } catch (error) {
    next(error);
  }
};

const deleteShortCourse = async (req, res, next) => {
  try {
    const course = await ShortCourse.findByIdAndDelete(req.params.id);
    if (!course) {
      return errorResponse(res, 404, "Short course not found");
    }
    return successResponse(res, 200, "Short course deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getShortCourses,
  getShortCourseById,
  createShortCourse,
  updateShortCourse,
  deleteShortCourse,
};
