import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import { Story, StoryAudioFile } from "src/components/StoryCreator/store/state";
import axios, { AxiosResponse } from "axios";
import {
  getRandomString,
  replaceSpaceWithUnderscore,
} from "src/shared/utils/stringUtils";

import END_POINTS from "src/application/shared/endpoints";
import { OpenaiStore } from "../../store/store";
import { useApplicationContext } from "src/application/store/Provider";

export interface UseTextGeneration {
  isCreateAudioFetching: (isFetching: boolean) => void;
  handleCreateAudio: (story: Story) => Promise<StoryAudioFile | undefined>;
}

export const useCreateStoryAudio = (store: OpenaiStore): UseTextGeneration => {
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const isCreateAudioFetching = (isFetching: boolean) => {
    store.updateState("createAudio", {
      ...store.state.createStory,
      isFetching,
    });
  };

  const handleCreateAudio = async (
    story: Story
  ): Promise<StoryAudioFile | undefined> => {
    try {
      const { name } = store.state.profileInfo;
      if (!story) return;

      const fileName = `${replaceSpaceWithUnderscore(
        story.title
      ).toLowerCase()}_${name}_${getRandomString()}`;

      const getStoryText = () => {
        if (auth.user && auth.user.isPaidUser) {
          return `${story.mainStory} ${story.poem}`;
        } else {
          return `This story is created by TALE-POD    ${story.mainStory} ${story.poem}   Thank you for listening to stories created by TALE-POD`;
        }
      };

      const response: AxiosResponse<StoryAudioFile, StoryAudioFile> =
        await axios.post(
          END_POINTS.OPENAI.GENERATE.STORY_AUDIO,
          {
            fileName,
            storyId: story._id,
            audioFileVoice: store.state.createAudio.audioFileVoice.name,
            storyText: getStoryText(),
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Custom-Header": new Date().toISOString(),
            },
          }
        );

      isCreateAudioFetching(false);

      Notify({
        type: ToastTypes.Success,
        content: "Story audio created successfully.",
      });

      return response.data;
    } catch (error) {
      console.error("❌ Create Audio Error!", { error });
      isCreateAudioFetching(false);

      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.statusText,
          type: ToastTypes.Error,
        });

        console.error("❌ Failed to create an audio file for the story!", {
          error: error.response.statusText,
        });
      } else {
        Notify({
          content: `❌ Oops! Something went wrong.\n${error}`,
          type: ToastTypes.Error,
        });
      }
    }

    return;
  };

  return {
    isCreateAudioFetching,
    handleCreateAudio,
  };
};
