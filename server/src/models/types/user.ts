import { ObjectId } from "mongodb";
import Stripe from "stripe";

export enum AuthProviderEnum {
  google = "google",
  phone = "phone",
}

export interface User {
  _id?: ObjectId;
  userId: string;
  email: string;
  phoneNumber?: string;
  phoneVerified?: boolean;
  name: UserName;
  picture: string;
  createdAt: Date;
  lastLogin: Date;
  stories: string[];
  storyCount: number;
  status: UserStatus;
  role: UserRole;
  isPaidUser: boolean;
  subscription?: UserSubscription;
  stripeCustomerId?: string;
  preferences?: UserPreferences;
  location?: string;
  timezone?: string;
  refreshToken?: string;
  provider?: AuthProviderEnum;
  verified?: boolean;
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
  paymentStatus: Stripe.Checkout.Session.PaymentStatus;
  plan: Stripe.Plan | undefined;
  price: Stripe.Price | undefined;
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
  theme: "light" | "dark";
  notifications: boolean;
  languagePreference?: string;
}

export const getInitialUserData = (): Omit<User, "_id"> => {
  return {
    userId: "",
    email: "",
    name: {
      givenName: "",
      familyName: "",
    },
    picture: "",
    createdAt: new Date(),
    lastLogin: new Date(),
    stories: [],
    storyCount: 0,
    status: UserStatus.active,
    role: UserRole.user,
    isPaidUser: false,
    preferences: {
      theme: "dark",
      notifications: false,
      languagePreference: "en",
    },
    subscription: {
      id: "",
      type: SubscriptionPlanEnum.Free,
      startDate: new Date(),
      maxStoriesAllowed: 4,
      endDate: new Date(),
      paymentStatus: "unpaid",
      plan: undefined,
      price: undefined,
    },
  };
};
