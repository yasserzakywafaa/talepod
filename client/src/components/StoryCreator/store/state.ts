import { Country } from "src/shared/countries";
import { Environment } from "src/shared/generatedStory/Environments";
import { Moral } from "src/shared/generatedStory/Moral";
import { Tone } from "src/shared/generatedStory/Tone";

export interface StoryCreatorInitialState {
  isFetching: boolean;
  childInfo: ChildInfo;
  generatedStory: GeneratedStory;
}

export enum ChildGenderEnum {
  Boy = "Boy",
  Girl = "Girl",
}

export type ChildInfo = {
  name: string;
  gender: ChildGenderEnum;
  age: number;
  interests: string;
  nationality?: Country;
};

export interface GeneratedStory {
  tone: Tone;
  moral: Moral;
  audioLength: number;
  maxCharacters: number;
  environment: Environment;
}

export const getStoryCreatorInitialState = (): StoryCreatorInitialState => {
  return {
    isFetching: false,
    childInfo: {
      name: "Cookie",
      gender: ChildGenderEnum.Girl,
      age: 2,
      interests: "Football",
      nationality: {
        name: "Egypt",
        value: "EG",
      },
    },
    generatedStory: {
      audioLength: 5,
      maxCharacters: 2000,
      moral: {
        name: "Honesty",
        value: "HON",
      },
      tone: {
        name: "Adventurous",
        value: "ADV",
      },
      environment: {
        name: "Snowy Mountain",
        value: "SM",
      },
    },
  };
};
