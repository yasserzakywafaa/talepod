import { ChildInfo } from "../domain/state";

export const getOptionsAutoPromptString = (childInfo: ChildInfo): string => {
  const { name, gender, age, hairColor, eyeColor, race, height, nationality } =
    childInfo;

  const fullDynamicPrompt = `Create a story of 2 pages for a ${age} years old ${gender} named ${name}, with physical characteristics, like the ${gender}'s hair color is ${hairColor}, ${eyeColor} eye color, height of ${height}, and from a country of ${nationality.name} and ${race} race`;

  return fullDynamicPrompt;
};
