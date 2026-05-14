import { configureGoogleStrategy } from "../strategies/googleStrategy";
import passport from "passport";

export const initializePassport = () => {
  passport.initialize();
  configureGoogleStrategy();
};
