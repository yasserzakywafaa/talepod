import { Plan, Price } from "./payment";

export interface User {
  _id: string;
  userId: string;
  email: string;
  name: UserName;
  picture: string;
  createdAt: Date;
  lastLogin: Date;
  stories: string[];
  storyCount: number;
  status: UserStatus;
  role: UserRole;
  isPaidUser: boolean;
  subscription: UserSubscription;
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
  editor = "editor",
  user = "user",
}

export interface UserSubscription {
  subscription: string | undefined;
  type: SubscriptionPlanEnum;
  startDate: Date;
  endDate: Date;
  paymentHistory?: UserPaymentHistory[];
  maxStoriesAllowed: number;
  plan: Plan;
  price: Price;
}

export enum SubscriptionPlanEnum {
  free = "free",
  premium = "premium",
  advanced = "advanced",
}

export interface UserPaymentHistory {
  transactionId: string;
  amount: number;
  date: Date;
}

export interface UserPreferences {
  theme: "light" | "dark";
  notifications: boolean;
  languagePreference?: string;
}
