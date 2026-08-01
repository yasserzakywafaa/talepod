import type { OpenaiStore } from "./store";
import { useCreateStory } from "../useCreateStory";

export interface OpenaiManager {
  isCreateStoryFetching: (isFetching: boolean) => void;
  handleUpdateCreateStoryPrompt: (autoTextPrompt: string) => void;
  handleCreateStoryRequest: ReturnType<
    typeof useCreateStory
  >["handleCreateStoryRequest"];
}

/** Create-story API only; the server builds the prompt from these params. */
export const useOpenAiGPTManager = (store: OpenaiStore): OpenaiManager => {
  const {
    isCreateStoryFetching,
    handleUpdateCreateStoryPrompt,
    handleCreateStoryRequest,
  } = useCreateStory(store);

  return {
    isCreateStoryFetching,
    handleUpdateCreateStoryPrompt,
    handleCreateStoryRequest,
  };
};
