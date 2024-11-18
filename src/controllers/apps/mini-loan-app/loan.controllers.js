import { LoanStatus, UserRolesEnum } from "../../../constants";
import { User } from "../../../models/apps/auth/user.models";
import {
  Loan,
  ScheduledLoanRepayment,
} from "../../../models/apps/mini-loan-app/loanschema";
import { ApiError } from "../../../utils/ApiError";
import { ApiResponse } from "../../../utils/ApiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";

const createLoanRequest = asyncHandler(async (req, res) => {
  const { amount, term } = req.body;

  if (!amount || !term) {
    throw new ApiError(400, "Amount and term both required for application");
  }

  //create a new loan request

  const loan = await Loan.create({
    userId: req.user._id,
    amount,
    term,
    status: "PENDING",
  });

  const weeklyRepayment = amount / term;

  const scheduledRepayments = []; //I have to push the Id's in it

  let startDate = new Date(); //start from todays date

  for (let i = 1; i <= term; i++) {
    let dueDate = new Date(startDate);
    dueDate.setDate(startDate.getDate() + i * 7); //adding 7 days for each week
    const scheduledLoanRepayments = await ScheduledLoanRepayment.create({
      dueDate: dueDate,
      amount: i === term ? weeklyRepayment + (amount % term) : weeklyRepayment,
      status: "PENDING",
    });
    scheduledRepayments.push(scheduledLoanRepayments._id);
  }

  loan.scheduledLoanRepaymentsId = scheduledRepayments;
  await loan.save();

  //Loan .aggregation needed while sending to frontend for repayment schedule
  const loan_F = await Loan.findById(loan._id);

  if (!loan_F) {
    throw new ApiError(500, "Internal server error Loan not created");
  }

  res
    .status(200)
    .json(new ApiResponse(200, loan_F, "Loan succesfully created"));
});

const AdminApprovalForLoan = asyncHandler(async (req, res) => {
  const { loanId } = req.params;

  const user = User.findById(req.user._id);

  if (user.role !== UserRolesEnum.ADMIN) {
    throw new ApiError(400, "This task can not be performed by a non-admin");
  }

  const loan = await Loan.findById(loanId);

  if (!loan) {
    throw new ApiError(400, "Loan not found");
  }

  if (loan.status === "APPROVED") {
    throw new ApiError(400, "Loan already approved");
  }

  loan.status = LoanStatus.APPROVED;
  await loan.save();

  res.status(200).json(new ApiResponse(200, {}, "Loan Status Approved"));
});

const ViewLoan = asyncHandler(async (req, res) => {
  const { loanid } = req.params;
  const loan = await Loan.findById(loanid);

  if (!loan) {
    throw new ApiError(400, "Invalid loan id or loan does not exists");
  }

  if (!loan.userId === req.user._id) {
    const user = await User.findById(req.user._id);
    if (!user.role === UserRolesEnum.ADMIN) {
      throw new ApiError(402, "You are not authorised to view this loan");
    }
  }

  const aggreagtedLoans = []; //Have to aggregate loan here to send in frontend

  res.status(200).json(new ApiResponse(200, loan, "Loan succesfully fetched"));
});

const handleLoanRepayment = asyncHandler(async (req, res) => {});

export {
  createLoanRequest,
  AdminApprovalForLoan,
  ViewLoan,
  handleLoanRepayment,
};
