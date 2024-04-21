import { StoryCreatorStore } from "./store";

export interface StoryCreatorManager {
  handleUpdateChildInfo: (name: string, value: string) => void;
}

export const useStoryCreatorManager = (
  store: StoryCreatorStore
): StoryCreatorManager => {
  const handleUpdateChildInfo = (name: string, value: string) => {
    console.log("handleUpdateChildInfo:>>>", {
      name,
      value,
    });
    store.updateState({
      childInfo: {
        ...store.state.childInfo,
        [name as string]: value as string,
      },
    });
  };

  return {
    handleUpdateChildInfo,
  };
};
