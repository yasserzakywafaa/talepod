import { AppWithGoogleAuthContextProvider } from "src/components/shared/SocialLogins/GoogleAuth/store/Provider";
import { ApplicationContextProvider } from "./store/Provider";
import { LoginModalContextProvider } from "src/components/Modals/LoginModal/store/Provider";
import { OpenAiGPTContextProvider } from "src/components/StoryCreator/features/OpenAiGPT/store/Provider";
import React from "react";
import { RegisterModalContextProvider } from "src/components/Modals/RegisterModal/store/Provider";
import { StoryCreatorContextProvider } from "src/components/StoryCreator/store/Provider";
import combineProviders from "./shared/combineProviders";

const contextProviders = [
  ApplicationContextProvider,
  LoginModalContextProvider,
  RegisterModalContextProvider,
  StoryCreatorContextProvider,
  OpenAiGPTContextProvider,

  // Authentication
  AppWithGoogleAuthContextProvider,
];

const AppContextProviders: React.FC<{ children: React.ReactNode }> =
  combineProviders(contextProviders);

export default AppContextProviders;
