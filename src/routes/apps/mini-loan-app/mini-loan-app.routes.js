import { Router } from "express";
import { verifyJWT } from "../../../middlewares/auth.middlewares";
import {
  AdminApprovalForLoan,
  createLoanRequest,
  handleLoanRepayment,
  ViewLoan,
} from "../../../controllers/apps/mini-loan-app/loan.controllers";

const router = Router();
router.use(verifyJWT);

router.route("/loans").post(createLoanRequest);

router.route("/loans/approve/:loanId").post(AdminApprovalForLoan);
router.route("/loans/view/:loanId").get(ViewLoan);
router.route("/loans/repayment/:repaymentId").post(handleLoanRepayment);
