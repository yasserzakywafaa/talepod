import React, { createContext, useContext, useState } from "react";

// Define the shape of your context data
type AppContextProps = {
  // Define your state and any functions you want to expose
  count: number;
  increment: (number: number) => void;
};

type InitialState = {
  count: number;
};

type AppContextProviderProps = { children: React.ReactNode };

const AppContext = createContext<AppContextProps>({
  count: 0,
  increment: () => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [state, setState] = useState<InitialState>({
    count: 0,
  });

  const updateIncrement = (newCount: number) => {
    setState((prev) => ({
      ...prev,
      count: prev.count + newCount,
    }));
  };

  const storeValue: AppContextProps = {
    count: state.count,
    increment: updateIncrement,
  };

  return (
    <AppContext.Provider value={storeValue}>{children}</AppContext.Provider>
  );
};
