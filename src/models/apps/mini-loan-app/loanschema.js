import mongoose, { Schema } from "mongoose";

const scheduledLoanRepaymentSchema = new mongoose.Schema({
  dueDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "PAID"],
    default: "PENDING",
  },
});

const LoanSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  term: { type: Number, required: true }, //Loan terms in weeks
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "PAID"],
    default: "PENDING",
    scheduledRepayments: [scheduledLoanRepaymentSchema],
  },
});
