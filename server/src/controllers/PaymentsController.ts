import { NextFunction, Request, Response } from "express";
import { SubscriptionPlanEnum, User } from "../models/types";

import CONFIG from "./../config";
import { GoogleAnalyticsPayload } from "src/models/types/googleAnalystics";
import Stripe from "stripe";
import axios from "axios";
import { getUserDataById } from "../utils/fetchData";
import { updateUserInDb } from "../models/mongoDb/index";

const secretKey = CONFIG.IS_DEV
  ? CONFIG.STRIPE_TEST_SECRET_KEY
  : CONFIG.STRIPE_LIVE_SECRET_KEY;

const webhookSecret = CONFIG.IS_DEV
  ? CONFIG.STRIPE_TEST_WEBHOOK_SECRET
  : CONFIG.STRIPE_LIVE_WEBHOOK_SECRET;

const stripe = new Stripe(secretKey ?? "", {
  typescript: true,
});

export const config = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
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
  next: NextFunction,
): Promise<void> => {
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
  next: NextFunction,
): Promise<void> => {
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
  next: NextFunction,
): Promise<void> => {
  const {
    priceId,
    subscriptionPlan,
    userId,
    success_url,
    cancel_url,
    googleAnalyticsClientId,
    mode = "subscription",
    credits,
  } = request.body.metadata;
  const user = await getUserDataById(userId);
  // Pay-per-story is a one-time purchase (mode "payment"); subscriptions keep
  // the original "subscription" mode. Default preserves existing behavior.
  const isOneTimePurchase = mode === "payment";

  try {
    // Create a new Stripe Checkout Session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          ...(isOneTimePurchase
            ? {
                adjustable_quantity: {
                  enabled: true,
                  minimum: 1,
                  maximum: 100,
                },
              }
            : {
                adjustable_quantity: {
                  enabled: false,
                },
              }),

          quantity: 1,
        },
      ],
      mode: isOneTimePurchase ? "payment" : "subscription",
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
        googleAnalyticsClientId,
        purchaseType: isOneTimePurchase ? "story_credit" : "subscription",
        ...(isOneTimePurchase ? { credits: String(credits ?? 1) } : {}),
      },
      customer: user.stripeCustomerId ?? undefined,
    };

    // subscription_data is only valid in subscription mode.
    if (!isOneTimePurchase) {
      sessionParams.subscription_data = {
        metadata: {
          userId,
          subscriptionPlan,
          googleAnalyticsClientId,
        },
      };
      sessionParams.expand = ["subscription"];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    if (CONFIG.IS_PROD) {
      try {
        // Send current session to Google Analytics
        const timeStamp = session.created * 1000;
        const totalAmount =
          (session.amount_total && session.amount_total / 100) ?? 0;
        const payload: GoogleAnalyticsPayload = {
          timestamp_micros: timeStamp,
          client_id: googleAnalyticsClientId || "1234567890.987654321",
          non_personalized_ads: true,
          events: [
            {
              name: "begin_checkout",
              params: {
                debug_mode: true,
                value: totalAmount,
                affiliation: undefined,
                transaction_id: undefined,
                currency: session.currency ?? "eur",
                event_timestamp: timeStamp,
                items: [
                  {
                    item_name: subscriptionPlan, // Plan name
                    item_id: priceId,
                    price: totalAmount,
                    quantity: 1,
                    item_category: "Subscription", // Optional: Category of the product
                  },
                ],
              },
            },
          ],
        };
        await sendToGoogleAnalytics(payload);
      } catch (error) {
        console.error(
          `❌  Failed to send session data to Google Analytics!`,
          error,
        );
      }
    }

    console.log("ℹ️  createCheckoutSession:>>>", { user, session });

    response.json({ sessionId: session.id });
  } catch (error) {
    console.error(`❌  Failed to Create Checkout Session!`, { error });
    const errorAny = error as any;

    response.status(500).json({ error: errorAny.message as any });
  }
};

export const webhook = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      request.headers["stripe-signature"] ?? "",
      webhookSecret ?? "",
    );
    await handleWebhookEvents(event);

    response.json({ event, received: true });
  } catch (error) {
    console.error(`❌  Failed to verify Webhook signature!`, error);
    response
      .status(400)
      .send(`❌  Failed to verify Webhook signature! ${error}`);
  }
};

export const handleWebhookEvents = async (
  event: Stripe.Event,
): Promise<void> => {
  const { type, data } = event;
  let session: Stripe.Checkout.Session;
  let subscription: Stripe.Subscription;
  let invoice: Stripe.Invoice;
  let paymentMethod: Stripe.PaymentMethod;

  switch (type) {
    // Checkout Session
    case "checkout.session.async_payment_failed":
      session = data.object;
      console.log(
        "❌ webhook:>>> checkout.session.async_payment_failed!",
        session,
      );
      return;
    case "checkout.session.async_payment_succeeded":
      session = data.object;
      console.log(
        "✅  webhook:>>> checkout.session.async_payment_succeeded!",
        session,
      );
      return;
    case "checkout.session.completed":
      session = data.object;
      console.log("✅ webhook:>>>checkout.session.completed!", session);
      // One-time pay-per-story purchases settle here (subscriptions settle via
      // invoice.payment_succeeded). Grant the purchased story credits.
      if (session.mode === "payment" && session.payment_status === "paid") {
        try {
          await handleGrantStoryCredits(session);
        } catch (error) {
          console.error(`❌  Failed to grant story credits!`, error);
        }
      }
      return;
    case "checkout.session.expired":
      session = data.object;
      console.log("⚠️ webhook:>>> checkout.session.expired!", session);
      return;

    // Customer Subscription
    case "customer.subscription.created":
      subscription = data.object;
      console.log(
        "✅ webhook:>>> customer.subscription.created!",
        subscription,
      );
      return;
    case "customer.subscription.deleted":
      subscription = data.object;
      console.log(
        "✅  webhook:>>> customer.subscription.deleted!",
        subscription,
      );
      return;
    case "customer.subscription.paused":
      subscription = data.object;
      console.log(
        "⏸️  webhook:>>> customer.subscription.paused!",
        subscription,
      );
      return;
    case "customer.subscription.resumed":
      subscription = data.object;
      console.log(
        "✅  webhook:>>> customer.subscription.resumed!",
        subscription,
      );
      return;
    case "customer.subscription.trial_will_end":
      subscription = data.object;
      console.log(
        "⚠️ webhook:>>> customer.subscription.trial_will_end!",
        subscription,
      );
      return;
    case "customer.subscription.updated":
      subscription = data.object;
      console.log(
        "✅  webhook:>>> customer.subscription.updated!",
        subscription,
      );
      return;

    // Invoice
    case "invoice.payment_action_required":
      invoice = data.object;
      console.log("⚠️ webhook:>>> payment_action_required!", invoice);
      return;
    case "invoice.payment_failed":
      invoice = data.object;
      console.log("❌ webhook:>>> invoice.payment_failed!", invoice);
      return;
    case "invoice.payment_succeeded":
      invoice = data.object;
      console.log("✅ webhook:>>> invoice.payment_succeeded!", invoice);
      if (invoice.paid) {
        try {
          await handleUpdateUserSubscription(invoice);
        } catch (error) {
          console.error(`❌  Failed to update user subscription!`, error);
        }

        if (CONFIG.IS_PROD) {
          try {
            await handleSendSubscriptionToGoogleAnalytics(invoice);
          } catch (error) {
            console.error(
              `❌  Failed to send subscription to Google Analytics!`,
              error,
            );
          }
        }
      }

      return;

    // Payment Method
    case "payment_method.automatically_updated":
      paymentMethod = data.object;
      console.log(
        "✅ webhook:>>> payment_method.automatically_updated!",
        paymentMethod,
      );
      return;
    case "payment_method.updated":
      paymentMethod = data.object;
      console.log("✅ webhook:>>> payment_method.updated!", paymentMethod);
      return;
  }

  return undefined;
};

export const handleGrantStoryCredits = async (
  session: Stripe.Checkout.Session,
): Promise<void> => {
  const userId = session.metadata?.userId || session.client_reference_id || "";
  const credits = Number(session.metadata?.credits ?? 1) || 1;

  if (!userId) {
    console.error(
      `❌  Cannot grant story credits — missing userId on session.`,
    );
    return;
  }

  try {
    const user = await getUserDataById(userId);
    const newTotal = (user.storyCredits ?? 0) + credits;

    await updateUserInDb(userId, { storyCredits: newTotal });

    console.log(
      `✅ Granted ${credits} story credit(s) to user ${userId}. New total: ${newTotal}`,
    );
  } catch (error) {
    console.error(`❌  Failed to grant story credits!`, { error });
    throw error;
  }
};

export const handleUpdateUserSubscription = async (
  invoice: Stripe.Invoice,
): Promise<void> => {
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) {
    console.error(`❌  'subscriptionId' is required!`);
    return;
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(
      subscriptionId as string,
    );
    const subscriptionItem = subscription.items.data[0];

    console.log(`ℹ️ handleUpdateUserSubscription:>>> 1️⃣`, {
      invoice,
      subscriptionId,
      subscription,
      subscriptionItem,
    });

    const user = await getUserDataById(subscription.metadata.userId);
    const userInfoToUpdate: Partial<User> = {
      isPaidUser: true,
      storyCount: 0,
      subscription: {
        id: subscriptionId as string,
        type: subscription.metadata.subscriptionPlan as SubscriptionPlanEnum,
        startDate: new Date(subscription.current_period_start * 1000),
        endDate: new Date(subscription.current_period_end * 1000),
        maxStoriesAllowed:
          CONFIG[
            `MAX_STORIES_LIMIT_${subscription.metadata.subscriptionPlan.toUpperCase()}`
          ],
        paymentHistory: [
          {
            transactionId: `${invoice.id}`,
            amount: invoice.total,
            currency: invoice.currency,
            date: new Date(),
          },
        ],
        paymentStatus: "paid",
        plan: subscriptionItem.plan,
        price: subscriptionItem.price,
      },
      stripeCustomerId: invoice.customer as string,
    };

    console.log("handleUpdateUserSubscription:>>> 2️⃣", {
      user,
      userInfoToUpdate,
      paymentHistory: userInfoToUpdate.subscription?.paymentHistory?.[0],
    });

    await updateUserInDb(subscription.metadata.userId, {
      ...userInfoToUpdate,
    });
  } catch (error) {
    console.error(`❌  Failed to update User Subscription!`, { error });
    return;
  }
};

export const handleSendSubscriptionToGoogleAnalytics = async (
  invoice: Stripe.Invoice,
): Promise<void> => {
  const subscriptionId = invoice.subscription as string;
  const totalAmount = invoice.total / 100;
  if (!subscriptionId) {
    console.error(`❌  'subscriptionId' is required!`);
    return;
  }
  const payload: GoogleAnalyticsPayload = {
    timestamp_micros: invoice.created * 1000,
    client_id:
      invoice.subscription_details?.metadata?.googleAnalyticsClientId ||
      "1234567890.987654321",
    non_personalized_ads: true,
    events: [
      {
        name: "purchase",
        params: {
          debug_mode: true,
          value: totalAmount,
          affiliation: "Stripe",
          currency: invoice.currency,
          transaction_id: subscriptionId,
          event_timestamp: invoice.created * 1000,
          items: [
            {
              item_name:
                invoice.subscription_details?.metadata?.subscriptionPlan ??
                SubscriptionPlanEnum.Premium, // Plan name
              item_id: subscriptionId,
              price: totalAmount,
              quantity: 1,
              item_category: "Subscription", // Optional: Category of the product
            },
          ],
        },
      },
    ],
  };
  await sendToGoogleAnalytics(payload);
};

export const sendToGoogleAnalytics = async (
  payload: GoogleAnalyticsPayload,
): Promise<void> => {
  const POST_URL = CONFIG.GOOGLE_ANALYTICS_TRACKING_URL(
    CONFIG.GOOGLE_ANALYTICS_MEASUREMENT_ID ?? "",
    CONFIG.GOOGLE_ANALYTICS_API_SECRET ?? "",
  );

  console.log("✅ sendToGoogleAnalytics:>>>", POST_URL, payload);

  try {
    const response = await axios.post(POST_URL, payload);
    console.log("ℹ️ GA4 Response:>>>", {
      response: response,
      responseData: response.data,
    });
  } catch (error) {
    console.error(`❌  Failed to send subscription data to Google Analytics!`, {
      error,
    });
    return;
  }
};

export const getCheckoutSessionData = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const sessionId = request.query.sessionId as string;
  const userId = request.query.userId as string;
  if (!sessionId) {
    response.status(400).json({ message: "❌ 'sessionId' is required!" });
    return;
  }

  try {
    const user = await getUserDataById(userId);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["invoice", "subscription"],
    });
    // One-time (pay-per-story) sessions have no subscription — guard for it.
    const subscription = session.subscription as Stripe.Subscription | null;
    const subscriptionItem = subscription?.items?.data?.[0];

    response.status(200).json({ session, subscriptionItem, user });
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
  next: NextFunction,
): Promise<void> => {
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
  next: NextFunction,
): Promise<void> => {
  const { subscriptionId, userId, userStoryCount } = request.body;

  console.log("ℹ️ cancelSubscription:>>> request.body>>>", {
    subscriptionId,
    userId,
    userStoryCount,
  });

  try {
    const cancelSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: true,
      },
    );

    // Update User Data
    const updatedUserData: Partial<User> = {
      isPaidUser: false,
      storyCount: userStoryCount,
      subscription: {
        id: cancelSubscription.id,
        type: SubscriptionPlanEnum.Free,
        startDate: new Date(),
        endDate: new Date(),
        paymentStatus: "unpaid",
        plan: cancelSubscription.items.data[0].plan,
        price: cancelSubscription.items.data[0].price,
        maxStoriesAllowed: CONFIG.MAX_STORIES_LIMIT_FREE,
      },
    };
    const updatedUser = await updateUserInDb(userId, updatedUserData);

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
  handleWebhookEvents,
};

export default PaymentsController;
