import { AppWithGoogleAuthContextProvider } from "src/components/shared/SocialLogins/GoogleAuth/store/Provider";
import { ApplicationContextProvider } from "./store/Provider";
import { BlogContextProvider } from "src/Pages/Blog/store/Provider";
import { BlogsContextProvider } from "src/Pages/Blogs/store/Provider";
import { CancelSubscriptionModalContextProvider } from "src/components/Modals/CancelSubscriptionModal/store/Provider";
import { ContactContextProvider } from "src/Pages/Contact/store/Provider";
import { GenerationContextProvider } from "src/components/StoryCreator/generation/Provider";
import { DashboardOverviewContextProvider } from "src/Pages/Dashboard/DashboardOverview/store/Provider";
import { DashboardStoriesContextProvider } from "src/Pages/Dashboard/DashboardStories/store/Provider";
import { DashboardUserContextProvider } from "src/Pages/Dashboard/DashboardUser/store/Provider";
import { DashboardUsersContextProvider } from "src/Pages/Dashboard/DashboardUsers/store/Provider";
import { LibraryContextProvider } from "src/Pages/Library/store/Provider";
import { LoginModalContextProvider } from "src/components/Modals/LoginModal/store/Provider";
import { MyProfileContextProvider } from "src/Pages/MyProfile/store/Provider";
import { MyStoriesContextProvider } from "src/Pages/MyStories/store/Provider";
import { OpenaiContextProvider } from "src/components/StoryCreator/features/Openai/store/Provider";
import { PaymentContextProvider } from "src/components/shared/Payment/store/Provider";
import { PaymentStatusContextProvider } from "src/Pages/PaymentStatus/store/Provider";
import { PricingContextProvider } from "src/Pages/Pricing/store/Provider";
import { PricingModalContextProvider } from "src/components/Modals/PricingModal/store/Provider";
import React from "react";
import { RegisterModalContextProvider } from "src/components/Modals/RegisterModal/store/Provider";
import { StoryCreatorContextProvider } from "src/components/StoryCreator/store/Provider";
import { ViewStoryContextProvider } from "src/Pages/ViewStory/store/Provider";
import combineProviders from "./shared/combineProviders";

const contextProviders = [
  ApplicationContextProvider,
  PricingModalContextProvider,
  StoryCreatorContextProvider,
  OpenaiContextProvider,
  GenerationContextProvider,
  LibraryContextProvider,
  PricingContextProvider,
  MyStoriesContextProvider,
  MyProfileContextProvider,
  ViewStoryContextProvider,
  ContactContextProvider,
  BlogsContextProvider,
  BlogContextProvider,
  PaymentContextProvider,
  PaymentStatusContextProvider,

  // Dashboard Pages
  DashboardOverviewContextProvider,
  DashboardUsersContextProvider,
  DashboardUserContextProvider,
  DashboardStoriesContextProvider,

  // Modals
  LoginModalContextProvider,
  RegisterModalContextProvider,
  PricingModalContextProvider,
  CancelSubscriptionModalContextProvider,

  // Authentication
  AppWithGoogleAuthContextProvider,
];

const AppContextProviders: React.FC<{ children: React.ReactNode }> =
  combineProviders(contextProviders);

export default AppContextProviders;
