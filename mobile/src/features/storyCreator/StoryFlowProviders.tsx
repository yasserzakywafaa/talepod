import type { ReactNode } from "react";

import { GenerationContextProvider } from "src/features/storyCreator/generation/Provider";
import { OpenaiContextProvider } from "src/features/storyCreator/openai/store/Provider";
import { StoryCreatorContextProvider } from "src/features/storyCreator/store/Provider";

export const StoryFlowProviders = ({ children }: { children: ReactNode }) => (
  <StoryCreatorContextProvider>
    <OpenaiContextProvider>
      <GenerationContextProvider>{children}</GenerationContextProvider>
    </OpenaiContextProvider>
  </StoryCreatorContextProvider>
);
