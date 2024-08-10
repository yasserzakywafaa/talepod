export interface User {
  _id: string;
  userId: string;
  email: string;
  name: UserName;
  picture: string;
  createdAt: Date;
  lastLogin?: Date;
  stories?: string[];
  storyCount: number;
  status: UserStatus;
  role: UserRole;
  isPaidUser: boolean;
  subscription?: UserSubscription;
  location?: string;
  timezone?: string;
  languagePreference?: string;
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
  subscriptionPlan?: string;
  subscriptionExpiry?: Date;
  paymentHistory?: UserPaymentHistory[];
  preferences?: UserPreferences;
}

export interface UserPaymentHistory {
  transactionId: string;
  amount: number;
  date: Date;
}

export interface UserPreferences {
  theme: "light" | "dark";
  notifications: boolean;
}
