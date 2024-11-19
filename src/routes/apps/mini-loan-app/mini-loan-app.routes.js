import { Router } from "express";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  AdminApprovalForLoan,
  createLoanRequest,
  handleLoanRepayment,
  ViewLoan,
  viewRepaymentDetails,
} from "../../../controllers/apps/mini-loan-app/loan.controllers.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(createLoanRequest);

router.route("/approve/:loanId").post(AdminApprovalForLoan);
router.route("/view/:loanId").get(ViewLoan);
router
  .route("/repayment/:repaymentId")
  .post(handleLoanRepayment)
  .get(viewRepaymentDetails);

export default router;
