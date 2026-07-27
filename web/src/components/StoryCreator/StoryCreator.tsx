import React from "react";
import { StoryCreatorContent } from "./StoryCreatorContent";
import { StoryCreatorContextProvider } from "./store/Provider";

const StoryCreator: React.FC = () => {
  return (
    <StoryCreatorContextProvider>
      <StoryCreatorContent />
    </StoryCreatorContextProvider>
  );
};

export default StoryCreator;
