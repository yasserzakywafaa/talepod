import { PaymentSuccessManager, usePaymentSuccessManager } from "./manager";
import { createContext, useContext } from "react";
import usePaymentSuccessStore, { PaymentSuccessStore } from "./store";

export interface PaymentSuccessContextProps {
  store: PaymentSuccessStore;
  manager: PaymentSuccessManager;
}

export interface PaymentSuccessContextProviderProps {
  children: React.ReactNode;
}

const PaymentSuccessContext = createContext<
  PaymentSuccessContextProps | undefined
>(undefined);

export const usePaymentSuccessContext = () => {
  const context = useContext(PaymentSuccessContext);
  if (!context) {
    throw new Error(
      "usePaymentSuccessContext must be used within an PaymentSuccessContextProvider"
    );
  }
  return context;
};

export const PaymentSuccessContextProvider = (
  params: PaymentSuccessContextProviderProps
) => {
  const store = usePaymentSuccessStore();
  const manager = usePaymentSuccessManager(store);

  return (
    <PaymentSuccessContext.Provider value={{ store, manager }}>
      {params.children}
    </PaymentSuccessContext.Provider>
  );
};
