import type { OpenaiStore } from "./store";
import { useCreateStory } from "../useCreateStory";

export interface OpenaiManager {
  isCreateStoryFetching: (isFetching: boolean) => void;
  handleUpdateCreateStoryPrompt: (autoTextPrompt: string) => void;
  handleCreateStoryRequest: ReturnType<
    typeof useCreateStory
  >["handleCreateStoryRequest"];
  handleCreateStorySeoRequest: ReturnType<
    typeof useCreateStory
  >["handleCreateStorySeoRequest"];
}

/** Create-story API only; prompt is built at submit time in useGenerateStory. */
export const useOpenAiGPTManager = (store: OpenaiStore): OpenaiManager => {
  const {
    isCreateStoryFetching,
    handleUpdateCreateStoryPrompt,
    handleCreateStoryRequest,
    handleCreateStorySeoRequest,
  } = useCreateStory(store);

  return {
    isCreateStoryFetching,
    handleUpdateCreateStoryPrompt,
    handleCreateStoryRequest,
    handleCreateStorySeoRequest,
  };
};
