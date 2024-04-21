import { Country } from "src/shared/countries";

export interface StoryCreatorInitialState {
  isFetching: boolean;
  childInfo: ChildInfo;
}

export enum ChildGenderEnum {
  boy = "boy",
  girl = "girl",
}

export type ChildInfo = {
  name: string;
  gender: ChildGenderEnum;
  age: number;
  hairColor: string;
  eyeColor: string;
  race: string;
  height: number;
  nationality: Country;
};

export const getStoryCreatorInitialState = (): StoryCreatorInitialState => {
  return {
    isFetching: false,
    childInfo: {
      name: "Yasser",
      gender: ChildGenderEnum.boy,
      age: 4,
      hairColor: "Blond",
      eyeColor: "Brown",
      race: "White",
      height: 50,
      nationality: {
        name: "Switzerland",
        value: "CH",
      },
    },
  };
};
