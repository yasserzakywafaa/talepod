import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import CONFIG from "./../config";

const stripe = new Stripe(CONFIG.STRIPE_TEST_SECRET_KEY, {
  typescript: true,
});

export const config = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    response.status(200).json({ publishableKey: CONFIG.STRIPE_TEST_PUB_KEY });
  } catch (error) {
    console.error("❌ Failed to get Stripe Publishable Key!", {
      error,
    });
    next(error);
  }
};

export const createPaymentIntnet = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { product } = request.body;
  if (!product) {
    response.status(400).json({ message: "❌ 'product' is required!" });
    return;
  }

  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
    });

    console.log("ℹ️  createPaymentIntnet:>>>", {
      product,
      paymentIntent,
    });

    response.status(200).json({
      // response.send({
      client_secret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("❌ Failed to create Stripe Payment Intent!", {
      error,
    });
    next(error);
  }
};

const PaymentsController = {
  config,
  createPaymentIntnet,
};

export default PaymentsController;
