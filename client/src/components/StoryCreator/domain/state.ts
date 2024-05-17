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
  height: number;
  nationality: Country;
};

export const getStoryCreatorInitialState = (): StoryCreatorInitialState => {
  return {
    isFetching: false,
    childInfo: {
      name: "Cookie",
      gender: ChildGenderEnum.girl,
      age: 2,
      hairColor: "Black",
      eyeColor: "Brown",
      height: 50,
      nationality: {
        name: "Egypt",
        value: "EG",
      },
    },
  };
};
