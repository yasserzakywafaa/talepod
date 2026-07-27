import { BlogManager, useBlogManager } from "./manager";
import { createContext, useContext } from "react";
import useBlogStore, { BlogStore } from "./store";

export interface BlogContextProps {
  store: BlogStore;
  manager: BlogManager;
}

export interface BlogContextProviderProps {
  children: React.ReactNode;
}

const BlogContext = createContext<BlogContextProps | undefined>(undefined);

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error(
      "useBlogContext must be used within an BlogContextProvider"
    );
  }
  return context;
};

export const BlogContextProvider = (params: BlogContextProviderProps) => {
  const store = useBlogStore();
  const manager = useBlogManager(store);

  return (
    <BlogContext.Provider value={{ store, manager }}>
      {params.children}
    </BlogContext.Provider>
  );
};
