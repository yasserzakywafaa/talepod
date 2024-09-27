import PaymentsController from "../controllers/PaymentsController";
import END_POINTS from "../models/endpoints";
import { Router } from "express";

const paymentsRouter = Router();

// Define API routes
paymentsRouter.get(
  END_POINTS.PAYMENTS.CONFIG,
  PaymentsController.config
);


paymentsRouter.post(
  END_POINTS.PAYMENTS.CREATE_PAYMENT_INTENT,
  PaymentsController.createPaymentIntnet
);

export default paymentsRouter;
