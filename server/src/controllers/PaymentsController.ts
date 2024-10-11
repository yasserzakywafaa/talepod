import { NextFunction, Request, Response } from "express";
import { SubscriptionPlanEnum, User } from "../models/types";

import CONFIG from "./../config";
import Stripe from "stripe";
import { getUserDataById } from "../utils/fetchData";
import { updateUserInDb } from "../models/mongoDb/index";

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
  next: NextFunction
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
  next: NextFunction
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
  next: NextFunction
): Promise<void> => {
  const { priceId, subscriptionPlan, userId, success_url, cancel_url } =
    request.body.metadata;

  const user = await getUserDataById(userId);
  console.log("ℹ️  createCheckoutSession:>>> User", { user });

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
        checkoutSessionId: "{CHECKOUT_SESSION_ID}",
      },
      customer: user.stripeCustomerId ?? undefined,
      subscription_data: {
        // Passed to "metadata" for the "subscriptions.retrieve()"" method
        metadata: {
          userId,
          subscriptionPlan,
          checkoutSessionId: "{CHECKOUT_SESSION_ID}",
        },
      },
    });

    console.log("ℹ️  createCheckoutSession:>>> session", { session });

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
): Promise<void> => {
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      request.headers["stripe-signature"],
      webhookSecret
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
  event: Stripe.Event
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
        session
      );
      return;
    case "checkout.session.async_payment_succeeded":
      session = data.object;
      console.log(
        "✅  webhook:>>> checkout.session.async_payment_succeeded!",
        session
      );
      return;
    case "checkout.session.completed":
      session = data.object;
      console.log("✅ webhook:>>>checkout.session.completed!", session);
      return;
    case "checkout.session.expired":
      console.log("❌ webhook:>>> checkout.session.expired!", data);
      return;

    // Customer Subscription
    case "customer.subscription.created":
      subscription = data.object;
      console.log(
        "✅ webhook:>>> customer.subscription.created!",
        subscription
      );
      return;
    case "customer.subscription.deleted":
      subscription = data.object;
      console.log(
        "✅  webhook:>>> customer.subscription.deleted!",
        subscription
      );
      return;
    case "customer.subscription.paused":
      subscription = data.object;
      console.log(
        "✅  webhook:>>> customer.subscription.paused!",
        subscription
      );
      return;
    case "customer.subscription.resumed":
      subscription = data.object;
      console.log(
        "✅  webhook:>>> customer.subscription.resumed!",
        subscription
      );
      return;
    case "customer.subscription.trial_will_end":
      subscription = data.object;
      console.log(
        "⚠️ webhook:>>> customer.subscription.trial_will_end!",
        subscription
      );
      return;
    case "customer.subscription.updated":
      subscription = data.object;
      console.log(
        "✅  webhook:>>> customer.subscription.updated!",
        subscription
      );
      return;

    // Invoice
    case "invoice.payment_action_required":
      invoice = data.object;
      console.log("⚠️ webhook:>>> payment_action_required!", invoice);
      return;
    case "invoice.payment_failed":
      invoice = data.object;
      console.log("❌ webhook:>>> Invoice Payment failed!", invoice);
      return;
    case "invoice.payment_succeeded":
      invoice = data.object;
      console.log("✅ webhook:>>> Invoice Payment succeeded!", invoice);
      if (invoice.paid) {
        try {
          await handleUpdateUserSubscription(invoice);
        } catch (error) {
          console.error(`❌  Failed to update user subscription!`, error);
        }
      }

      return;

    // Payment Method
    case "payment_method.automatically_updated":
      paymentMethod = data.object;
      console.log(
        "✅ webhook:>>> payment_method.automatically_updated!",
        paymentMethod
      );
      return;
    case "payment_method.updated":
      paymentMethod = data.object;
      console.log("✅ webhook:>>> payment_method.updated!", paymentMethod);
      return;
  }

  return undefined;
};

export const handleUpdateUserSubscription = async (
  invoice: Stripe.Invoice
): Promise<void> => {
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) {
    console.error(`❌  'subscriptionId' is required!`);
    return;
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(
      subscriptionId as string
    );
    const subscriptionItem: Stripe.SubscriptionItem = (
      await stripe.subscriptions.retrieve(subscriptionId as string)
    ).items.data[0];

    console.error(
      `ℹ️ handleUpdateUserSubscription:>>> invoice.subscription:>>>`,
      { subscriptionId, subscription, subscriptionItem }
    );

    const user = await getUserDataById(subscription.metadata.userId);
    const userInfoToUpdate: Partial<User> = {
      isPaidUser: true,
      subscription: {
        id: subscriptionId as string,
        type: subscription.metadata.subscriptionPlan as SubscriptionPlanEnum,
        startDate: new Date(invoice.period_start * 1000),
        endDate: new Date(invoice.period_end * 1000),
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

    console.log("handleUpdateUserSubscription:>>>", {
      user,
      userInfoToUpdate,
      // session,
      invoice,
    });

    await updateUserInDb(subscription.metadata.userId, {
      ...userInfoToUpdate,
    });
  } catch (error) {
    console.error(`❌  Failed to get subscription data!`, { error });
    return;
  }
};

export const getCheckoutSessionData = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const sessionId = request.query.sessionId as string;
  const userId = request.query.userId as string;

  if (!sessionId) {
    response.status(400).json({ message: "❌ 'sessionId' is required!" });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const subscriptionItem: Stripe.SubscriptionItem = (
      await stripe.subscriptions.retrieve(session.subscription as string)
    ).items.data[0];
    const user = await getUserDataById(userId);

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
  next: NextFunction
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
  next: NextFunction
): Promise<void> => {
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
        paymentStatus: "unpaid",
        plan: cancelSubscription.items.data[0].plan,
        price: cancelSubscription.items.data[0].price,
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
