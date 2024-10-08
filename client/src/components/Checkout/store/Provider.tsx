import { createContext, useContext } from "react";
import useCheckoutStore, { CheckoutStore } from "./store";
import { CheckoutManager, useCheckoutManager } from "./manager";

export interface CheckoutContextProps {
  store: CheckoutStore;
  manager: CheckoutManager;
}

export interface CheckoutContextProviderProps {
  children: React.ReactNode;
}

const CheckoutContext = createContext<
  CheckoutContextProps | undefined
>(undefined);

export const useCheckoutContext = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error(
      "useCheckoutContext must be used within an CheckoutContextProvider"
    );
  }
  return context;
};

export const CheckoutContextProvider = (
  params: CheckoutContextProviderProps
) => {
  const store = useCheckoutStore();
  const manager = useCheckoutManager(store);

  return (
    <CheckoutContext.Provider value={{ store, manager }}>
      {params.children}
    </CheckoutContext.Provider>
  );
};
