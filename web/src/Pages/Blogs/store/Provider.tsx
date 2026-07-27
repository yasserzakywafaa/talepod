import { BlogsManager, useBlogsManager } from "./manager";
import { createContext, useContext } from "react";
import useBlogsStore, { BlogsStore } from "./store";

export interface BlogsContextProps {
  store: BlogsStore;
  manager: BlogsManager;
}

export interface BlogsContextProviderProps {
  children: React.ReactNode;
}

const BlogsContext = createContext<BlogsContextProps | undefined>(undefined);

export const useBlogsContext = () => {
  const context = useContext(BlogsContext);
  if (!context) {
    throw new Error(
      "useBlogsContext must be used within an BlogsContextProvider"
    );
  }
  return context;
};

export const BlogsContextProvider = (params: BlogsContextProviderProps) => {
  const store = useBlogsStore();
  const manager = useBlogsManager(store);

  return (
    <BlogsContext.Provider value={{ store, manager }}>
      {params.children}
    </BlogsContext.Provider>
  );
};
