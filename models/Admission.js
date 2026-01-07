const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
    },
    contactNumber: {
      type: Number,
      required: true,
    },
    qualification: {
      type: String,
    },
    joiningDate: Date,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShortCourse",
    },
    address: {
      type: String,
      required: true,
    },
    registrationPaymentMode: String,
    registrationPayment: String,
    installment: String,
    due: Number,
    dueDate: String,
  },
  { timestamps: true }
);

const Admission = mongoose.model("Admission", admissionSchema);

module.exports = Admission;
