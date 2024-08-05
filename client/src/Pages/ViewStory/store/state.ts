import {
  AdultGenderEnum,
  ChildGenderEnum,
  Story,
} from "src/components/StoryCreator/store/state";

import { Languages } from "src/shared/languages";

export interface ViewStoryInitialState {
  story: Story;
  isFetching: boolean;
  isCreatingAudio: boolean;
}

export const getViewStoryInitialState = (): ViewStoryInitialState => {
  return {
    isFetching: false,
    isCreatingAudio: false,
    story: {
      _id: "",
      title: "",
      slug: "",
      summary: "",
      mainStory: "",
      poem: "",
      createdAt: new Date(),
      audioFile: {
        url: "",
        fileName: "",
        createdAt: new Date(),
      },
      profileInfo: {
        name: "",
        gender: ChildGenderEnum.Girl || AdultGenderEnum.Female,
        age: 1,
        interests: "",
        language: Languages[0],
      },
      storyParams: {
        audioLength: 10,
        minCharacters: 3900,
        maxCharacters: 4000,
        totalCharacters: 4000,
        moral: {
          name: "",
          value: "",
        },
        tone: {
          name: "",
          value: "",
        },
        environment: {
          name: "",
          value: "",
        },
      },
    },
  };
};
