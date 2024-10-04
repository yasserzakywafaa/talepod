import express, { Router } from "express";

import END_POINTS from "../models/endpoints";
import PaymentsController from "../controllers/PaymentsController";

const paymentsRouter = Router();

// Define API routes
paymentsRouter.get(END_POINTS.PAYMENTS.CONFIG, PaymentsController.config);

paymentsRouter.get(
  END_POINTS.PAYMENTS.GET_PRODUCTS_LIST_WITH_PRICES,
  PaymentsController.getProductsListWithPrices
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

paymentsRouter.get(
  END_POINTS.PAYMENTS.GET_CHECKOUT_SESSION_DATA,
  PaymentsController.getCheckoutSessionData
);

export default paymentsRouter;
