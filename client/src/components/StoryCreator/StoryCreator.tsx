import React from "react";
import { StoryCreatorContent } from "./StoryCreatorContent";
import { StoryCreatorContextProvider } from "./domain/Provider";

const StoryCreator: React.FC = () => {
  return (
    <StoryCreatorContextProvider>
      <StoryCreatorContent />
    </StoryCreatorContextProvider>
  );
};

export default StoryCreator;
