const Student = require("../models/Student");
const {
  successResponse,
  errorResponse,
  paginatedResponse,
} = require("../utils/responseHandler");

// @desc    Get all students with pagination and search
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res, next) => {
  try {
    const {
      name,
      contactNumber,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;
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

    // Date range filter on joiningDate
    if (startDate || endDate) {
      query.joiningDate = {};
      if (startDate) {
        query.joiningDate.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.joiningDate.$lte = end;
      }
    }

    const [students, totalCount] = await Promise.all([
      Student.find(query)
        .populate("course")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Student.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return paginatedResponse(
      res,
      200,
      "Students retrieved successfully",
      students,
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

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate("course");

    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }

    return successResponse(res, 200, "Student retrieved successfully", student);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private
const createStudent = async (req, res, next) => {
  try {
    // Auto-generate r_no (Registration Number)
    const lastStudent = await Student.findOne().sort({ r_no: -1 }).lean();
    const r_no = lastStudent ? lastStudent.r_no + 1 : 1;

    // Create student with auto-generated r_no
    const student = await Student.create({
      ...req.body,
      r_no,
    });

    const populatedStudent = await Student.findById(student._id).populate(
      "course"
    );

    return successResponse(
      res,
      201,
      "Student created successfully",
      populatedStudent
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("course");

    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }

    return successResponse(res, 200, "Student updated successfully", student);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }

    return successResponse(res, 200, "Student deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

// @desc    Get students with overdue fees
// @route   GET /api/students/overdue
// @access  Private
const getOverdueStudents = async (req, res, next) => {
  try {
    const Admission = require("../models/Admission");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Helper function to parse date strings (handles multiple formats)
    const parseDate = (dateStr) => {
      if (!dateStr) return null;

      // Try parsing as ISO format (YYYY-MM-DD)
      let date = new Date(dateStr);
      if (!isNaN(date.getTime())) return date;

      // Try parsing DD/MM/YYYY format
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        if (!isNaN(date.getTime())) return date;
      }

      return null;
    };

    // Fetch all students and admissions
    const [students, admissions] = await Promise.all([
      Student.find().populate("course").lean(),
      Admission.find().populate("course").lean(),
    ]);

    // Filter overdue students
    const overdueStudents = students
      .filter((student) => {
        if (!student.dueDate || !student.due || student.due <= 0) return false;
        const dueDate = parseDate(student.dueDate);
        return dueDate && dueDate < today;
      })
      .map((student) => ({
        ...student,
        studentType: "Student",
        daysOverdue: Math.floor(
          (today - parseDate(student.dueDate)) / (1000 * 60 * 60 * 24)
        ),
      }));

    // Filter overdue admissions
    const overdueAdmissions = admissions
      .filter((admission) => {
        if (!admission.dueDate || !admission.due || admission.due <= 0)
          return false;
        const dueDate = parseDate(admission.dueDate);
        return dueDate && dueDate < today;
      })
      .map((admission) => ({
        ...admission,
        studentType: "Admission",
        daysOverdue: Math.floor(
          (today - parseDate(admission.dueDate)) / (1000 * 60 * 60 * 24)
        ),
      }));

    // Combine and sort by days overdue (most overdue first)
    const allOverdue = [...overdueStudents, ...overdueAdmissions].sort(
      (a, b) => b.daysOverdue - a.daysOverdue
    );

    return successResponse(
      res,
      200,
      "Overdue students retrieved successfully",
      allOverdue
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Search students and admissions combined (for fee collection)
// @route   GET /api/students/search
// @access  Private
const searchStudentsAndAdmissions = async (req, res, next) => {
  try {
    const Admission = require("../models/Admission");
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return successResponse(res, 200, "Search results", []);
    }

    const searchRegex = new RegExp(q.trim(), "i");
    const isNumber = !isNaN(q.trim());

    // Build query for both collections
    let query = {
      $or: [{ firstName: searchRegex }, { lastName: searchRegex }],
    };

    // If the query looks like a contact number, also search by contact
    if (isNumber) {
      query.$or.push({ contactNumber: parseInt(q.trim()) });
    }

    // Search both students and admissions in parallel
    const [students, admissions] = await Promise.all([
      Student.find(query).populate("course").limit(10).lean(),
      Admission.find(query).populate("course").limit(10).lean(),
    ]);

    // Format results with type indicator
    const results = [
      ...students.map((s) => ({
        _id: s._id,
        firstName: s.firstName,
        lastName: s.lastName,
        contactNumber: s.contactNumber,
        course: s.course,
        type: "student",
        displayName: `${s.firstName} ${s.lastName}`,
        courseName: s.course?.courseName || "N/A",
      })),
      ...admissions.map((a) => ({
        _id: a._id,
        firstName: a.firstName,
        lastName: a.lastName,
        contactNumber: a.contactNumber,
        course: a.course,
        type: "admission",
        displayName: `${a.firstName} ${a.lastName}`,
        courseName: a.course?.courseName || "N/A",
      })),
    ];

    return successResponse(res, 200, "Search results", results);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getOverdueStudents,
  searchStudentsAndAdmissions,
};
