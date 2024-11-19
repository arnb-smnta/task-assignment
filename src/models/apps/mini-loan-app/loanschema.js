import mongoose, { Schema } from "mongoose";

// Define the ScheduledLoanRepayment Schema
const scheduledLoanRepaymentSchema = new Schema(
  {
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
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan", // Refers to the Loan collection
      required: true,
    },
    repaymentDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Define the Loan Schema
const loanSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to the User collection
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    term: {
      type: Number,
      required: true, // Loan term in weeks
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "PAID"],
      default: "PENDING",
    },
    scheduledRepaymentsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ScheduledLoanRepayment", // Refers to the ScheduledLoanRepayment collection
      },
    ],
    amountDue: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Create Models
const Loan = mongoose.model("Loan", loanSchema);
const ScheduledLoanRepayment = mongoose.model(
  "ScheduledLoanRepayment",
  scheduledLoanRepaymentSchema
);

// Export the Models
export { Loan, ScheduledLoanRepayment };
