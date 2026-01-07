const mongoose = require("mongoose");

const shortCourseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      unique: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    courseDuration: {
      type: String,
      required: true,
    },
    courseFee: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ShortCourse = mongoose.model("ShortCourse", shortCourseSchema);

module.exports = ShortCourse;
