import { Story } from "src/application/shared/interfaces";

export interface ViewStoryInitialState {
  isFetching: boolean;
  story: Story;
}

export const getViewStoryInitialState = (): ViewStoryInitialState => {
  return {
    isFetching: false,
    story: {
      _id: "",
      title: "",
      summary: "",
      mainStory: "",
      poem: "",
      audioFile: {
        url: "",
        fileName: "",
        createdAt: new Date(),
      },
      createdAt: new Date(),
    },
  };
};
