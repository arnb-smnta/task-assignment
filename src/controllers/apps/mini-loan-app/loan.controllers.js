import mongoose from "mongoose";
import {
  LoanStatus,
  repaymentStatus,
  UserRolesEnum,
} from "../../../constants.js";
import { User } from "../../../models/apps/auth/user.models.js";
import {
  Loan,
  ScheduledLoanRepayment,
} from "../../../models/apps/mini-loan-app/loanschema.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

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
      loanId: loan._id,
    });
    scheduledRepayments.push(scheduledLoanRepayments._id);
  }

  loan.scheduledRepaymentsId = scheduledRepayments;
  await loan.save();

  //Sending only the loan without aggregation for frontend to fetch with _id
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
  const { loanId } = req.params;

  const loan = await Loan.findById(loanId);

  if (!loan) {
    throw new ApiError(400, "Invalid loan id or loan does not exists");
  }

  if (!loan.userId === req.user._id) {
    const user = await User.findById(req.user._id);
    if (!user.role === UserRolesEnum.ADMIN) {
      throw new ApiError(402, "You are not authorised to view this loan");
    }
  }

  const aggreagatedLoans = await Loan.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(loanId), // Dynamically match the loan document by its _id
      },
    },
    {
      $lookup: {
        from: "scheduledloanrepayments",
        let: { repaymentIds: "$scheduledRepaymentsId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$repaymentIds"],
              },
            },
          },
        ],
        as: "repayments",
      },
    },
    {
      $project: {
        _id: 1,
        dueDate,
        amount: 1,
        status: 1,
        repayments: {
          $map: {
            input: "$repayments",
            as: "repayment",
            in: {
              _id: "$$repayment._id",
              dueDate: "$$repayment.dueDate",
              amount: "$$repayment.amount",
              status: "$$repayment.status",
            },
          },
        },
      },
    },
  ]);
  //Have to aggregate loan here to send in frontend

  res
    .status(200)
    .json(new ApiResponse(200, aggreagatedLoans, "Loan succesfully fetched"));
});

const handleLoanRepayment = asyncHandler(async (req, res) => {
  const { repaymentId } = req.params;
  const { repaymentDate } = req.body;
  const repayment = await ScheduledLoanRepayment(repaymentId);

  if (!repayment) {
    throw new ApiError(400, "Invalid Repayment ID");
  }

  if (repayment.status === repaymentStatus.PAID) {
    throw new ApiError(400, "Repayment Status Already Paid");
  }
  const loan = await Loan.findById(repayment.loanId);
  if (!loan.status === LoanStatus.APPROVED) {
    throw new ApiError(400, "Loan is not approved to make any repayments");
  }

  if (!repaymentDate) {
    repaymentDate = Date.now();
  }
  repayment.repaymentDate = repaymentDate;
  repayment.status = repaymentStatus.PAID;
  repayment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Repayment Status Updated"));
});

const viewRepaymentDetails = asyncHandler(async (req, res) => {
  const { repaymentId } = req.params;

  const repayment = await ScheduledLoanRepayment.findById(repaymentId);

  if (!repayment) {
    throw new ApiError(400, "repayment schedule not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, repayment, "Repayemnt details fetched succesfully")
    );
});

export {
  createLoanRequest,
  AdminApprovalForLoan,
  ViewLoan,
  handleLoanRepayment,
  viewRepaymentDetails,
};
