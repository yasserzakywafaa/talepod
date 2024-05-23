import { ApplicationContextProvider } from "./store/Provider";
import { LoginModalContextProvider } from "src/components/Modals/LoginModal/store/Provider";
import React from "react";
import { RegisterModalContextProvider } from "src/components/Modals/RegisterModal/store/Provider";
import combineProviders from "./shared/combineProviders";

const providers = [
  ApplicationContextProvider,
  LoginModalContextProvider,
  RegisterModalContextProvider,
];

const AppProviders: React.FC<{ children: React.ReactNode }> =
  combineProviders(providers);

export default AppProviders;
