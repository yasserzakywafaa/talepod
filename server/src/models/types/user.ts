import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
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
  type: SubscriptionPlanEnum;
  startDate: Date;
  endDate: Date;
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

export const getInitialUserData = (): Omit<User, "_id"> => {
  const initialExpiryDate = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1)
  );

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
    subscription: {
      type: SubscriptionPlanEnum.free,
      startDate: undefined,
      endDate: undefined,
      paymentHistory: [],
      preferences: {
        theme: "dark",
        notifications: false,
        languagePreference: "en",
      },
      maxStoriesAllowed: 4,
    },
  };
};
