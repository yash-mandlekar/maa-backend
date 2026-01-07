const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "studentModelType",
    },
    studentModelType: {
      type: String,
      enum: ["Student", "Admission"],
      required: true,
    },
    registrationPaymentMode: String,
    payment: {
      type: Number,
      required: true,
    },
    payDate: {
      type: Date,
      default: Date.now,
    },
    feeType: {
      type: String,
      default: "Regular Fee",
    },
  },
  {
    timestamps: true,
  }
);

const Fees = mongoose.model("Fees", feesSchema);

module.exports = Fees;
