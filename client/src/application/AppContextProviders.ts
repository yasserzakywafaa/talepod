import { AppWithGoogleAuthContextProvider } from "src/components/shared/SocialLogins/GoogleAuth/store/Provider";
import { ApplicationContextProvider } from "./store/Provider";
import { ContactContextProvider } from "src/Pages/Contact/store/Provider";
import { ExploreContextProvider } from "src/Pages/Explore/store/Provider";
import { LoginModalContextProvider } from "src/components/Modals/LoginModal/store/Provider";
import { OpenaiContextProvider } from "src/components/StoryCreator/features/Openai/store/Provider";
import React from "react";
import { RegisterModalContextProvider } from "src/components/Modals/RegisterModal/store/Provider";
import { StoryCreatorContextProvider } from "src/components/StoryCreator/store/Provider";
import { ViewStoryContextProvider } from "src/Pages/ViewStory/store/Provider";
import combineProviders from "./shared/combineProviders";

const contextProviders = [
  ApplicationContextProvider,
  LoginModalContextProvider,
  RegisterModalContextProvider,
  StoryCreatorContextProvider,
  ExploreContextProvider,
  OpenaiContextProvider,
  ViewStoryContextProvider,
  ContactContextProvider,

  // Authentication
  AppWithGoogleAuthContextProvider,
];

const AppContextProviders: React.FC<{ children: React.ReactNode }> =
  combineProviders(contextProviders);

export default AppContextProviders;
