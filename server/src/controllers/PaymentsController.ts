import * as DBUtils from "../models/mongoDb/index";

import { NextFunction, Request, Response } from "express";
import { SubscriptionPlanEnum, User } from "../models/types";

import CONFIG from "./../config";
import Stripe from "stripe";
import { WithId } from "mongodb";
import { getEndDateByInterval } from "../utils/dateUtils";

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
  const publishableKey = CONFIG.IS_DEV
    ? CONFIG.STRIPE_TEST_PUB_KEY
    : CONFIG.STRIPE_LIVE_PUB_KEY;
  try {
    response.status(200).json({ publishableKey });
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

    response.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe error: ", error);
    const errorAny = error as any;

    response.status(500).json({ error: errorAny.message as any });
  }
};

export const webhook = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const signature = request.headers["stripe-signature"];
  console.log("ℹ️ checkoutSessionWebhook:>>>", { request });

  let event;

  try {
    if (CONFIG.IS_DEV) {
      const payloadString = JSON.stringify(request.body, null, 2);
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: CONFIG.STRIPE_TEST_WEBHOOK_SECRET,
      });

      // Verify the Stripe webhook signature
      event = stripe.webhooks.constructEvent(
        payloadString,
        header,
        webhookSecret
      );

      console.log("ℹ️ checkoutSessionWebhook:>>> event:>>>", {
        event,
      });
    } else {
      // Verify the Stripe webhook signature
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        webhookSecret
      );
    }
  } catch (error) {
    console.error(`❌  Failed to verify Webhook signature!`, error);
    return response
      .status(400)
      .send(`❌  Failed to verify Webhook signature! ${error}`);
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

    if (!session.subscription) return;
    const subscriptionItem: Stripe.SubscriptionItem = (
      await stripe.subscriptions.retrieve(session.subscription as string)
    ).items.data[0];

    if (session.status === "complete" && session.payment_status === "paid") {
      const updatedUserData: Partial<User> = {
        isPaidUser: true,
        subscription: {
          id: `${session.subscription}`,
          type: session.metadata.subscriptionPlan as SubscriptionPlanEnum,
          startDate: new Date(),
          endDate: getEndDateByInterval(subscriptionItem.plan.interval),
          maxStoriesAllowed: 50,
          paymentHistory: [
            {
              transactionId: `${session.subscription}`,
              amount: session.amount_total / 100,
              date: new Date(),
            },
          ],
          plan: subscriptionItem.plan,
          price: subscriptionItem.price,
        },
      };

      if (session.client_reference_id !== session.metadata.userId) return;
      const updatedUser = await DBUtils.updateUserInDb(
        session.client_reference_id,
        updatedUserData
      );

      response.json({ session, subscriptionItem, updatedUser });
    } else {
      response.status(200).json({ session, subscriptionItem });
    }
  } catch (error) {
    console.error("❌ Failed to get the Session data!", {
      error,
    });
    next(error);
  }
};

export const getSubscriptionDetails = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const subscriptionId = request.query.subscriptionId as string;
  if (!subscriptionId) {
    response.status(400).json({ message: "❌ 'subscriptionId' is required!" });
    return;
  }

  try {
    const subscription: Stripe.Subscription =
      await stripe.subscriptions.retrieve(subscriptionId);

    response.status(200).json(subscription);
  } catch (error) {
    response
      .status(500)
      .json({ message: "❌ Failed to get user information!" });
  }
};

export const cancelSubscription = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { subscriptionId, userId } = request.body;

  console.log("ℹ️ cancelSubscription:>>> request.body>>>", {
    subscriptionId,
    userId,
  });

  try {
    const cancelSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    // Update User Data
    const updatedUserData: Partial<User> = {
      isPaidUser: false,
      subscription: {
        id: cancelSubscription.id,
        type: SubscriptionPlanEnum.Free,
        startDate: new Date(),
        endDate: new Date(),
        maxStoriesAllowed: 4,
        plan: cancelSubscription.items.data[0].plan,
        price: cancelSubscription.items.data[0].price,
      },
    };
    const updatedUser = await DBUtils.updateUserInDb(userId, updatedUserData);

    console.log("ℹ️ cancelSubscription", {
      cancelSubscription,
      updatedUserData,
    });

    response.json({ cancelSubscription, updatedUser });
    // response.json({ cancelSubscription });
  } catch (error) {
    console.error("❌ Failed to Cancel Subscription!", {
      error,
    });
    response.status(500).json({ error: "❌ Failed to Cancel Subscription!" });
  }
};

const PaymentsController = {
  config,
  webhook,
  getPricesList,
  getProductsListWithPrices,
  createCheckoutSession,
  getCheckoutSessionData,
  getSubscriptionDetails,
  cancelSubscription,
};

export default PaymentsController;
