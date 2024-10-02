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
  subscriptionPlanType: SubscriptionPlanEnum;
  subscriptionExpiry: Date;
  paymentHistory?: UserPaymentHistory[];
  preferences: UserPreferences;
  maxStoriesAllowed: number;
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
