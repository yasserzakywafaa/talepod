import { Mode, PaymentStatus, SessionStatus } from "src/shared/payment";

import { SubscriptionPlanEnum } from "src/shared/user";

export interface PaymentSuccessInitialState {
  isFetching: boolean;
  paymentSessionData: PaymentSessionData;
}

export interface PaymentSessionData {
  id: string;
  userId: string;
  amount_total: number;
  client_reference_id: string;
  currency: string;
  customer_details: {
    email: string;
    name: string;
  };
  invoice: string;
  livemode: false;
  locale: null;
  metadata: { subscriptionPlan: SubscriptionPlanEnum; userId: string };
  mode: Mode;
  payment_method_types: string[]; // ["card"]
  payment_status: PaymentStatus;
  status: SessionStatus;
  subscription: string;
}

export const getPaymentSuccessInitialState = (): PaymentSuccessInitialState => {
  return {
    isFetching: false,
    paymentSessionData: {
      id: "",
      userId: "",
      amount_total: 0,
      client_reference_id: "",
      currency: "eur",
      customer_details: {
        email: "",
        name: "",
      },
      invoice: "",
      livemode: false,
      locale: null,
      metadata: { subscriptionPlan: SubscriptionPlanEnum.premium, userId: "" },
      mode: "payment",
      payment_method_types: [], // ["card"]
      payment_status: "unpaid",
      status: "open",
      subscription: "",
    },
  };
};
