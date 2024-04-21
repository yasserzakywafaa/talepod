import { Notify, ToastTypes } from "src/components/Notification/Notification";

import END_POINTS from "src/lib/endpoints";
import { GoogleGeminiAIAnswerProps } from "./state";
import { GoogleGeminiStore } from "./store";
import axios from "axios";

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
  const handleIsFetching = (isFetching: boolean) => {
    store.updateState({
      ...store.state,
      isFetching,
    });
  };

  const handleUpdateChildInfo = (name: string, value: string) => {
    console.log("handleUpdateChildInfo:>>>", {
      name,
      value,
    });
    store.updateState({
      ...store.state,
      childInfo: {
        ...store.state.childInfo,
        [name as string]: value as string,
      },
    });
  };

  const handleUpdateOptionsAutoPrompt = (optionsAutoPrompt: string) => {
    store.updateState({
      ...store.state,
      optionsAutoPrompt,
    });
  };

  const handleUpdateUserPrompt = (userPrompt: string) => {
    store.updateState({
      ...store.state,
      userPrompt,
    });
  };

  const handleSetAiAnswer = (aiAnswer: GoogleGeminiAIAnswerProps) => {
    store.updateState({
      ...store.state,
      aiAnswer,
    });
  };

  const handleChatRequest = async (userPrompt: string) => {
    try {
      const URL = END_POINTS(userPrompt);
      const chatResponse = await axios.post(URL.GOOGLE_GEMINI.CHAT);
      console.log("GoogleGemini:>>> handleChatRequest:>>> CHAT", {
        chatResponse,
      });
      handleSetAiAnswer({
        statusCode: 200,
        title: "",
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
      const URL = END_POINTS(userPrompt);
      const generateResponse = await axios.post(URL.GOOGLE_GEMINI.GENERATE);
      console.log("GoogleGemini:>>> handleGenerateContent:>>> GENERATE", {
        generateResponse,
      });
      handleSetAiAnswer({
        statusCode: 200,
        title: "",
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
