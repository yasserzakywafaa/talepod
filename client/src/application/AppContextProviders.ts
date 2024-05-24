import { ApplicationContextProvider } from "./store/Provider";
import { LoginModalContextProvider } from "src/components/Modals/LoginModal/store/Provider";
import React from "react";
import { RegisterModalContextProvider } from "src/components/Modals/RegisterModal/store/Provider";
import combineProviders from "./shared/combineProviders";
import { AppWithGoogleAuthContextProvider } from "src/components/shared/SocialLogins/GoogleAuth/store/Provider";

const contextProviders = [
  ApplicationContextProvider,
  LoginModalContextProvider,
  RegisterModalContextProvider,

  // Authentication
  AppWithGoogleAuthContextProvider,
];

const AppContextProviders: React.FC<{ children: React.ReactNode }> =
  combineProviders(contextProviders);

export default AppContextProviders;
