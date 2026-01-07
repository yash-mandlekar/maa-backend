const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    inquiryType: {
      type: String,
      enum: ["student", "admission"],
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "courseModelType",
    },
    courseModelType: {
      type: String,
      enum: ["Course", "ShortCourse"],
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    rejected: {
      type: Boolean,
      default: false,
    },
    registered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);

module.exports = Inquiry;
