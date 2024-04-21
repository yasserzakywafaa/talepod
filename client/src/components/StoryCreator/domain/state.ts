import { Country } from "src/shared/countries";

export interface StoryCreatorInitialState {
  childInfo: ChildInfo;
}

export enum GenderEnum {
  male = "male",
  female = "female",
}

export type ChildInfo = {
  gender: GenderEnum;
  age: number;
  hairColor: string;
  eyeColor: string;
  race: string;
  height: number;
  nationality: Country;
};

export const getStoryCreatorInitialState = (): StoryCreatorInitialState => {
  return {
    childInfo: {
      gender: GenderEnum.female,
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
