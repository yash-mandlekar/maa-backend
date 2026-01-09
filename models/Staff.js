const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    staffId: {
      type: String,
    },
    role: {
      type: String,
      enum: ["staff", "teacher", "admin", "accountant"],
      default: "staff",
    },
    department: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    qualification: {
      type: String,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
    },
    totalExperience: {
      type: String,
    },
    salary: {
      type: Number,
    },
    joinDate: {
      type: Date,
    },
    jobTiming: {
      type: String,
    },
    position: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;
