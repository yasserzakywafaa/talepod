import { SubscriptionPlanEnum, User } from "../models/types";
import {
  CancelSubscriptionRequestBody,
  createStripeClient,
  createStripePaymentsService,
} from "@yasserzakywafaa/server-core";

import CONFIG from "./../config";
import Stripe from "stripe";
import { getUserDataById } from "../utils/fetchData";
import { updateUserInDb } from "../models/mongoDb/index";

// Stripe keys are environment-scoped (test in dev, live in prod). They are
// resolved here and injected into the shared payments service from server-core.
const secretKey = CONFIG.IS_DEV
  ? CONFIG.STRIPE_TEST_SECRET_KEY
  : CONFIG.STRIPE_LIVE_SECRET_KEY;

const webhookSecret = CONFIG.IS_DEV
  ? CONFIG.STRIPE_TEST_WEBHOOK_SECRET
  : CONFIG.STRIPE_LIVE_WEBHOOK_SECRET;

const publishableKey = CONFIG.IS_DEV
  ? CONFIG.STRIPE_TEST_PUB_KEY
  : CONFIG.STRIPE_LIVE_PUB_KEY;

// Local Stripe client used by the fulfillment hooks below (invoice → subscription).
const stripe = createStripeClient(secretKey ?? "");

// ─── TalePod-specific fulfillment hooks (domain logic kept app-side) ─────────

// One-time pay-per-story purchases settle on checkout.session.completed.
// Grant the purchased story credits to the user.
const handleGrantStoryCredits = async (
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

// Subscriptions settle on invoice.payment_succeeded. Upgrade the user to the
// paid plan and record the payment.
const handleUpdateUserSubscription = async (
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

// Cancel downgrades the user to Free (effective at period end).
const buildCancelSubscriptionUserUpdate = async (args: {
  user: unknown;
  canceledSubscription: Stripe.Subscription;
  requestBody: CancelSubscriptionRequestBody;
}): Promise<Record<string, unknown>> => {
  const { canceledSubscription, requestBody } = args;
  const userStoryCount = requestBody.userStoryCount as number | undefined;

  const updatedUserData: Partial<User> = {
    isPaidUser: false,
    storyCount: userStoryCount,
    subscription: {
      id: canceledSubscription.id,
      type: SubscriptionPlanEnum.Free,
      startDate: new Date(),
      endDate: new Date(),
      paymentStatus: "unpaid",
      plan: canceledSubscription.items.data[0].plan,
      price: canceledSubscription.items.data[0].price,
      maxStoriesAllowed: CONFIG.MAX_STORIES_LIMIT_FREE,
    },
  };

  return updatedUserData as unknown as Record<string, unknown>;
};

// ─── Wire the shared payments service with TalePod's config + hooks ──────────
// The service provides every request handler; GA4 (begin_checkout / purchase)
// is handled by core's tracker, gated on isProd — matching the prior behavior.

const paymentsService = createStripePaymentsService({
  stripe: {
    secretKey: secretKey ?? "",
    webhookSecret: webhookSecret ?? "",
    publishableKey: publishableKey ?? "",
  },
  ga4: {
    isProd: CONFIG.IS_PROD,
    measurementId: CONFIG.GOOGLE_ANALYTICS_MEASUREMENT_ID ?? "",
    apiSecret: CONFIG.GOOGLE_ANALYTICS_API_SECRET ?? "",
    buildTrackingUrl: CONFIG.GOOGLE_ANALYTICS_TRACKING_URL,
  },
  hooks: {
    getUserById: getUserDataById,
    onCheckoutSessionCompleted: handleGrantStoryCredits,
    onInvoicePaymentSucceeded: handleUpdateUserSubscription,
    buildCancelSubscriptionUserUpdate,
    updateUser: (userId, data) => updateUserInDb(userId, data as Partial<User>),
  },
});

const PaymentsController = {
  config: paymentsService.config,
  webhook: paymentsService.webhook,
  getPricesList: paymentsService.getPricesList,
  getProductsListWithPrices: paymentsService.getProductsListWithPrices,
  createCheckoutSession: paymentsService.createCheckoutSession,
  getCheckoutSessionData: paymentsService.getCheckoutSessionData,
  getSubscriptionDetails: paymentsService.getSubscriptionDetails,
  cancelSubscription: paymentsService.cancelSubscription,
  handleWebhookEvents: paymentsService.handleWebhookEvents,
};

export default PaymentsController;
