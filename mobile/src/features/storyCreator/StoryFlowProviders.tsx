import type { ReactNode } from "react";

import { GenerationContextProvider } from "src/features/storyCreator/generation/Provider";
import { StoryCreatorContextProvider } from "src/features/storyCreator/store/Provider";

export const StoryFlowProviders = ({ children }: { children: ReactNode }) => (
  <StoryCreatorContextProvider>
    <GenerationContextProvider>{children}</GenerationContextProvider>
  </StoryCreatorContextProvider>
);
