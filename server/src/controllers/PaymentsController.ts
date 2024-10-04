import { NextFunction, Request, Response } from "express";

import CONFIG from "./../config";
import Stripe from "stripe";

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

export const getPricesList = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const pricesList = await stripe.prices.list({
      active: true,
    });

    response.status(200).json(pricesList.data);
  } catch (error) {
    console.error("❌ Failed to get Stripe Prices list!", {
      error,
    });
    next(error);
  }
};

export const getProductsListWithPrices = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // Get all active Products List
    const products = await stripe.products.list({
      active: true,
    });

    // Get Prices list for each Product
    let prices: Stripe.Price[] = [];
    for (let item = 0; item < products.data.length; item++) {
      const product: Stripe.Product = products.data[item];

      const pricesList = await stripe.prices.list({
        product: product.id,
        active: true,
      });

      prices = [...prices, ...pricesList.data];
    }

    // Merge Products list with prices
    const productsWithPrices = products.data.map((product) => {
      return {
        ...product,
        prices: prices.filter((price) => price.product === product.id),
      };
    });

    response.status(200).json(productsWithPrices);
  } catch (error) {
    console.error("❌ Failed to get Stripe Product with Prices!", {
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
  const { priceId, subscriptionPlan, userId, success_url, cancel_url } =
    request.body.metadata;

  try {
    // Create a new Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
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

export const getCheckoutSessionData = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const sessionId = request.query.sessionId as string;
  if (!sessionId) {
    response.status(400).json({ message: "❌ 'sessionId' is required!" });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("ℹ️  getSessionData:>>>", {
      sessionId: session.id,
      status: session.status,
    });

    response.status(200).json(session);
  } catch (error) {
    console.error("❌ Failed to get the Session data!", {
      error,
    });
    next(error);
  }
};

const PaymentsController = {
  config,
  getPricesList,
  getProductsListWithPrices,
  createCheckoutSession,
  checkoutSessionWebhook,
  getCheckoutSessionData,
};

export default PaymentsController;
