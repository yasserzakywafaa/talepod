import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

import END_POINTS from "src/application/shared/endpoints";
import { GoogleGeminiAIAnswerProps } from "./state";
import { GoogleGeminiStore } from "./store";
import axios from "axios";
import { getAutoTextGenPromptString } from "src/components/StoryCreator/utils/getAutoPromptString";
import { useEffect } from "react";
import { useStoryCreatorContext } from "src/components/StoryCreator/store/Provider";

export interface GoogleGeminiManager {
  handleIsFetching: (isFetching: boolean) => void;
  handleUpdateChildInfo: (name: string, value: string) => void;
  handleUpdateOptionsAutoPrompt: (optionsAutoPrompt: string) => void;
  handleUpdateUserPrompt: (userPrompt: string) => void;
  handleSetAiAnswer: (aiAnswer: GoogleGeminiAIAnswerProps) => void;
  handleChatRequest: (userPrompt: string) => void;
  handleGenerateContent: (userPrompt: string) => void;
}

export const useGoogleGeminiManager = (
  store: GoogleGeminiStore
): GoogleGeminiManager => {
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

  const handleSetAiAnswer = (aiAnswer: GoogleGeminiAIAnswerProps) => {
    store.updateState("aiAnswer", {
      statusCode: aiAnswer.statusCode,
      title: aiAnswer.title,
      description: aiAnswer.description,
    });
  };

  const handleChatRequest = async (userPrompt: string) => {
    try {
      const chatResponse = await axios.post(END_POINTS.GOOGLE_GEMINI.CHAT, {
        userPrompt,
      });
      console.log("GoogleGemini:>>> handleChatRequest:>>> CHAT", {
        chatResponse,
      });
      handleSetAiAnswer({
        statusCode: chatResponse.status,
        title: chatResponse.statusText,
        description: chatResponse.data,
      });
      handleIsFetching(false);
    } catch (error) {
      console.error("GoogleGemini:>>> handleChatRequest:>>> CHAT Error", {
        error,
      });
      if (axios.isAxiosError(error) && error.response) {
        handleSetAiAnswer({
          statusCode: error.response.status,
          title: error.response.statusText,
          description: error.response.data.message,
        });
        Notify({
          content: `${error.response.status} ${error.response.statusText}\n${
            error.response.data.message ?? ""
          }`,
          type: ToastTypes.Error,
        });
      } else {
        Notify({
          content: `Oops! Something went wrong.\n${error}`,
          type: ToastTypes.Error,
        });
      }
      handleIsFetching(false);
    }
  };

  const handleGenerateContent = async (userPrompt: string) => {
    try {
      const generateResponse = await axios.post(
        END_POINTS.GOOGLE_GEMINI.GENERATE,
        // END_POINTS.TESTING.ROUTE_ONE,
        { userPrompt }
      );

      console.log("GoogleGemini:>>> handleGenerateContent:>>> GENERATE", {
        generateResponse,
      });
      handleSetAiAnswer({
        statusCode: generateResponse.status,
        title: generateResponse.statusText,
        description: generateResponse.data,
      });

      handleIsFetching(false);
    } catch (error) {
      console.error("GoogleGemini:>>> handleGenerateContent:>>> Error", {
        error,
      });

      if (axios.isAxiosError(error) && error.response) {
        handleSetAiAnswer({
          statusCode: error.response.status,
          title: error.response.statusText,
          description: error.response.data.message,
        });
        handleIsFetching(false);
        Notify({
          content: `${error.response.status} ${error.response.statusText}\n${error.response.data.message}`,
          type: ToastTypes.Error,
        });
      } else {
        handleIsFetching(false);
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
      getAutoTextGenPromptString(storyCreatorStore.state)
    );
  }, [storyCreatorStore.state.childInfo]);

  return {
    handleIsFetching,
    handleUpdateChildInfo,
    handleUpdateOptionsAutoPrompt,
    handleUpdateUserPrompt,
    handleSetAiAnswer,
    handleChatRequest,
    handleGenerateContent,
  };
};
