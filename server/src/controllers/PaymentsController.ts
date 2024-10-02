import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import CONFIG from "./../config";

const secretKey = CONFIG.IS_DEV
  ? CONFIG.STRIPE_TEST_SECRET_KEY
  : CONFIG.STRIPE_LIVE_SECRET_KEY;

const webhookSecret = CONFIG.IS_DEV
  ? CONFIG.STRIPE_TEST_WEBHOOK_SECRET
  : CONFIG.STRIPE_LIVE_WEBHOOK_SECRET;

const stripe = new Stripe(secretKey, {
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

export const createPaymentIntent = async (
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

export const createCheckoutSession = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { subscriptionPlan, userId, success_url, cancel_url } =
    request.body.metadata;

  const priceIdFromStripe = "price_1Q3eR2Iq8Ejb2pY9Cl8OLDfD";

  try {
    // Create a new Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceIdFromStripe,
          adjustable_quantity: {
            enabled: false,
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      ui_mode: "hosted",
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url,
      cancel_url,
      client_reference_id: userId,
      metadata: {
        userId,
        subscriptionPlan,
      },
    });

    // Return the session ID to the client
    response.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe error: ", error);
    const errorAny = error as any;

    response.status(500).json({ error: errorAny.message as any });
  }
};

export const checkoutSessionWebhook = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const sig = request.headers["stripe-signature"];

  console.log("ℹ️ checkoutSessionWebhook");

  let event;

  try {
    // Verify the Stripe webhook signature
    event = stripe.webhooks.constructEvent(request.body, sig, webhookSecret);
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed.`, err);
    return response.sendStatus(400);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Fulfill the order: Fetch the metadata from session, including userId
    console.log("checkoutSessionWebhook:>>> Payment succeeded!", session);
    console.log("checkoutSessionWebhook:>>> Metadata:", session.metadata);

    // You can now use session.metadata.userId to update the user's subscription status in your DB
  }

  // Return a 200 response to acknowledge receipt of the event
  return response.send();
};

const PaymentsController = {
  config,
  createPaymentIntent,
  createCheckoutSession,
  checkoutSessionWebhook,
};

export default PaymentsController;
