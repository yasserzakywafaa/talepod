import { AppWithGoogleAuthContextProvider } from "src/components/shared/SocialLogins/GoogleAuth/store/Provider";
import { ApplicationContextProvider } from "./store/Provider";
import { CancelSubscriptionModalContextProvider } from "src/components/Modals/CancelSubscriptionModal/store/Provider";
import { CheckoutContextProvider } from "src/components/Checkout/store/Provider";
import { ContactContextProvider } from "src/Pages/Contact/store/Provider";
import { ExploreContextProvider } from "src/Pages/Explore/store/Provider";
import { LoginModalContextProvider } from "src/components/Modals/LoginModal/store/Provider";
import { MyProfileContextProvider } from "src/Pages/MyProfile/store/Provider";
import { MyStoriesContextProvider } from "src/Pages/MyStories/store/Provider";
import { OpenaiContextProvider } from "src/components/StoryCreator/features/Openai/store/Provider";
import { PaymentContextProvider } from "src/components/shared/Payment/store/Provider";
import { PaymentSuccessContextProvider } from "src/Pages/PaymentSuccess/store/Provider";
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
  ExploreContextProvider,
  MyStoriesContextProvider,
  MyProfileContextProvider,
  ViewStoryContextProvider,
  ContactContextProvider,
  CheckoutContextProvider,
  PaymentContextProvider,
  PaymentSuccessContextProvider,

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
