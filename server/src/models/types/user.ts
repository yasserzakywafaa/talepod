import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  userId: string;
  email: string;
  name: UserName;
  picture: string;
  createdAt: Date;
  lastLogin?: Date;
  stories?: ObjectId[];
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
    stories: [],
    storyCount: 0,
    status: UserStatus.active,
    role: UserRole.user,
    isPaidUser: false,
  };
};
