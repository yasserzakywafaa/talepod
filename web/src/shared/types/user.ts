import { Plan, Price } from "./payment";

export interface User {
  _id: string;
  userId: string;
  email: string;
  phoneNumber?: string;
  phoneVerified?: boolean;
  provider?: string;
  verified?: boolean;
  name: UserName;
  picture: string;
  createdAt: Date;
  lastLogin: Date;
  stories: string[];
  storyCount: number;
  // Pay-per-story credits: each lets the user create one story beyond their
  // plan cap. Granted by a one-time Stripe payment, consumed at story creation.
  storyCredits?: number;
  status: UserStatus;
  role: UserRole;
  isPaidUser: boolean;
  subscription: UserSubscription;
  stripeCustomerId?: string;
  preferences: UserPreferences;
  location?: string;
  timezone?: string;
}

export interface UserName {
  givenName: string;
  familyName: string;
}

export enum UserStatus {
  active = "active",
  inactive = "inactive",
  suspended = "suspended",
  banned = "banned",
}

export enum UserRole {
  super_admin = "super_admin",
  admin = "admin",
  user = "user",
}

export interface UserSubscription {
  id: string | undefined;
  type: SubscriptionPlanEnum;
  startDate: Date;
  endDate: Date;
  paymentHistory?: UserPaymentHistory[];
  maxStoriesAllowed: number;
  plan: Plan;
  price: Price;
  cancel_at: number | null;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  cancellation_details: CancellationDetails;
  current_period_end: number;
  current_period_start: number;
}

export interface CancellationDetails {
  comment: string | null;
  reason:
    | "cancellation_requested"
    | "payment_disputed"
    | "payment_failed"
    | null;
}

export enum SubscriptionPlanEnum {
  Free = "Free",
  Premium = "Premium",
  Advanced = "Advanced",
}

export interface UserPaymentHistory {
  transactionId: string;
  currency: string;
  amount: number;
  date: Date;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  languagePreference?: string;
}
