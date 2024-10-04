import { MyProfileManager, useMyProfileManager } from "./manager";
import { createContext, useContext } from "react";
import useMyProfileStore, { MyProfileStore } from "./store";

export interface MyProfileContextProps {
  store: MyProfileStore;
  manager: MyProfileManager;
}

export interface MyProfileContextProviderProps {
  children: React.ReactNode;
}

const MyProfileContext = createContext<MyProfileContextProps | undefined>(
  undefined
);

export const useMyProfileContext = () => {
  const context = useContext(MyProfileContext);
  if (!context) {
    throw new Error(
      "useMyProfileContext must be used within an MyProfileContextProvider"
    );
  }
  return context;
};

export const MyProfileContextProvider = (params: MyProfileContextProviderProps) => {
  const store = useMyProfileStore();
  const manager = useMyProfileManager(store);

  return (
    <MyProfileContext.Provider value={{ store, manager }}>
      {params.children}
    </MyProfileContext.Provider>
  );
};
