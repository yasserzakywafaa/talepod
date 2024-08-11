import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import {
  ProfileInfo,
  Story,
  StoryParams,
  StorySeo,
} from "src/components/StoryCreator/store/state";
import axios, { AxiosResponse } from "axios";

import END_POINTS from "src/application/shared/endpoints";
import { OpenaiStore } from "../../store/store";
import { User } from "src/shared/user";
import { useApplicationContext } from "src/application/store/Provider";

export interface UseTextGeneration {
  isCreateStoryFetching: (isFetching: boolean) => void;
  handleUpdateCreateStoryPrompt: (createStoryPrompt: string) => void;
  handleCreateStoryRequest: (
    storyPrompt: string,
    profileInfo: ProfileInfo,
    storyParams: StoryParams
  ) => Promise<Story>;
  handleCreateStorySeoRequest: (
    storyId: string,
    userSeoPrompt: string
  ) => Promise<StorySeo>;
}

export const useCreateStory = (store: OpenaiStore): UseTextGeneration => {
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const isCreateStoryFetching = (isFetching: boolean) => {
    store.updateState("createStory", {
      ...store.state.createStory,
      isFetching,
    });
  };

  const handleUpdateCreateStoryPrompt = (createStoryPrompt: string) => {
    store.updateState("createStory", {
      ...store.state.createStory,
      createStoryPrompt,
    });
  };

  const handleCreateStoryRequest = async (
    storyPrompt: string,
    profileInfo: ProfileInfo,
    storyParams: StoryParams
  ): Promise<Story> => {
    const PAYLOAD = {
      storyPrompt,
      profileInfo,
      storyParams,
      userInfo: auth.user as User,
    };

    try {
      const response: AxiosResponse<Story, Story> = await axios.post(
        END_POINTS.OPENAI.GENERATE.STORY,
        PAYLOAD,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        }
      );

      store.updateState("createStory", {
        ...store.state.createStory,
        story: {
          ...response.data,
        },
      });

      Notify({
        type: ToastTypes.Success,
        content: "Story created successfully.",
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
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
      throw new Error(`❌  Failed to create a story!  ${error}`);
    }
  };

  const handleCreateStorySeoRequest = async (
    storyId: string,
    userSeoPrompt: string
  ): Promise<StorySeo> => {
    try {
      const response: AxiosResponse<StorySeo, StorySeo> = await axios.post(
        END_POINTS.OPENAI.GENERATE.STORY_SEO,
        {
          storyId,
          userSeoPrompt,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        }
      );

      if (store.state.createStory.story) {
        const updatedStory: Story = {
          ...store.state.createStory.story,
          seo: response.data,
        };

        console.log("✅ updatedStory", { updatedStory });

        // store.updateState("createStory", {
        //   ...store.state.createStory,
        //   story: updatedStory,
        // });
      }

      return response.data;
    } catch (error) {
      throw new Error(`❌  Failed to create story SEO!  ${error}`);
    }
  };

  return {
    isCreateStoryFetching,
    handleUpdateCreateStoryPrompt,
    handleCreateStoryRequest,
    handleCreateStorySeoRequest,
  };
};
