import { Notify, ToastTypes } from "src/components/Notification/Notification";

import END_POINTS from "src/lib/endpoints";
import { OpenAiGPTAIAnswerProps } from "./state";
import { OpenAiGPTStore } from "./store";
import axios from "axios";
import { getOptionsAutoPromptString } from "src/components/StoryCreator/utils/getOptionsAutoPromptString";
import { useEffect } from "react";
import { useStoryCreatorContext } from "src/components/StoryCreator/domain/Provider";

export interface OpenAiGPTManager {
  handleIsFetching: (isFetching: boolean) => void;
  handleUpdateChildInfo: (name: string, value: string) => void;
  handleUpdateOptionsAutoPrompt: (optionsAutoPrompt: string) => void;
  handleUpdateUserPrompt: (userPrompt: string) => void;
  handleSetAiAnswer: (aiAnswer: OpenAiGPTAIAnswerProps) => void;
  handleGenerateRequest: (userPrompt: string) => void;
}

export const useOpenAiGPTManager = (
  store: OpenAiGPTStore
): OpenAiGPTManager => {
  const { store: storyCreatorStore } = useStoryCreatorContext();

  const handleIsFetching = (isFetching: boolean) => {
    store.updateState("isFetching", isFetching);
  };

  const handleUpdateChildInfo = (name: string, value: string) => {
    const newChildInfo = {
      ...store.state.childInfo,
      [name as string]: value as string,
    };

    store.updateState("childInfo", newChildInfo);
  };

  const handleUpdateOptionsAutoPrompt = (optionsAutoPrompt: string) => {
    store.updateState("optionsAutoPrompt", optionsAutoPrompt);
  };

  const handleUpdateUserPrompt = (userPrompt: string) => {
    store.updateState("userPrompt", userPrompt);
  };

  const handleSetAiAnswer = (aiAnswer: OpenAiGPTAIAnswerProps) => {
    store.updateState("aiAnswer", {
      statusCode: aiAnswer.statusCode,
      title: aiAnswer.title,
      description: aiAnswer.description,
    });
  };

  const handleGenerateRequest = async (userPrompt: string) => {
    try {
      const URL = END_POINTS(userPrompt);
      const response = await axios.post(URL.OPENAI.USER_PROMPT);

      console.log("OpenAiSection:>>>", {
        response,
      });

      handleIsFetching(false);
      handleSetAiAnswer({
        statusCode: response.status,
        title: "",
        description: response.data,
      });
    } catch (error) {
      console.error("OpenAiSection:>>> Error", {
        error,
      });
      handleIsFetching(false);
      if (axios.isAxiosError(error) && error.response) {
        handleSetAiAnswer({
          statusCode: error.response.status,
          title: error.response.statusText,
          description: error.response.statusText,
        });
        Notify({
          content: error.response.statusText,
          type: ToastTypes.Error,
        });
      } else {
        Notify({
          content: `Oops! Something went wrong.\n${error}`,
          type: ToastTypes.Error,
        });
      }
    }
  };

  useEffect(() => {
    store.updateState("childInfo", storyCreatorStore.state.childInfo);
    store.updateState(
      "optionsAutoPrompt",
      getOptionsAutoPromptString(storyCreatorStore.state.childInfo)
    );
  }, [storyCreatorStore.state.childInfo]);

  return {
    handleIsFetching,
    handleUpdateChildInfo,
    handleUpdateOptionsAutoPrompt,
    handleUpdateUserPrompt,
    handleSetAiAnswer,
    handleGenerateRequest,
  };
};
