import mongoose, { Schema } from "mongoose";

const scheduledLoanRepaymentSchema = new mongoose.Schema(
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
      ref: loanSchema,
      required: true,
    },
  },
  { timestamps: true }
);

const loanSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    term: { type: Number, required: true }, //Loan terms in weeks
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "PAID"],
      default: "PENDING",
    },
    scheduledRepaymentsId: [
      { type: mongoose.Types.ObjectId, ref: scheduledLoanRepaymentSchema },
    ],
  },
  { timestamps: true }
);

export const Loan = mongoose.model("Loan", loanSchema);
export const ScheduledLoanRepayment = mongoose.model(
  "ScheduledLoanRepayment",
  scheduledLoanRepaymentSchema
);
