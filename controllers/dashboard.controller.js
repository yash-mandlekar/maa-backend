const Student = require("../models/Student");
const Fees = require("../models/Fees");
const Course = require("../models/Course");
const { successResponse } = require("../utils/responseHandler");

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();

    // Today range
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Current month range
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // Current year range
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    // Parallel queries for better performance
    const [
      totalStudents,
      totalCourses,
      todayFees,
      monthFees,
      yearFees,
      recentFees,
    ] = await Promise.all([
      Student.countDocuments(),
      Course.countDocuments(),
      Fees.aggregate([
        {
          $match: {
            payDate: { $gte: todayStart, $lte: todayEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$payment" },
          },
        },
      ]),
      Fees.aggregate([
        {
          $match: {
            payDate: { $gte: monthStart, $lte: monthEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$payment" },
          },
        },
      ]),
      Fees.aggregate([
        {
          $match: {
            payDate: { $gte: yearStart, $lte: yearEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$payment" },
          },
        },
      ]),
      Fees.find({
        payDate: { $gte: todayStart, $lte: todayEnd },
      })
        .populate("student")
        .sort({ payDate: -1 })
        .limit(10),
    ]);

    const stats = {
      totalStudents,
      totalCourses,
      fees: {
        today: todayFees[0]?.total || 0,
        month: monthFees[0]?.total || 0,
        year: yearFees[0]?.total || 0,
      },
      recentTransactions: recentFees,
    };

    return successResponse(
      res,
      200,
      "Dashboard statistics retrieved successfully",
      stats
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
