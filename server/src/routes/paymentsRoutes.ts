import PaymentsController from "../controllers/PaymentsController";
import END_POINTS from "../models/endpoints";
import express, { Router } from "express";

const paymentsRouter = Router();

// Define API routes
paymentsRouter.get(END_POINTS.PAYMENTS.CONFIG, PaymentsController.config);

paymentsRouter.post(
  END_POINTS.PAYMENTS.CREATE_PAYMENT_INTENT,
  PaymentsController.createPaymentIntent
);

paymentsRouter.post(
  END_POINTS.PAYMENTS.CREATE_CHECKOUT_SESSION,
  PaymentsController.createCheckoutSession
);

paymentsRouter.post(
  END_POINTS.PAYMENTS.CHECKOUT_SESSION_WEBHOOK,
  express.raw({ type: "application/json" }),
  PaymentsController.checkoutSessionWebhook
);

export default paymentsRouter;
