import { ChildInfo } from "../domain/state";

export const getAutoTextGenPromptString = (childInfo: ChildInfo): string => {
  const { name, gender, age, hairColor, eyeColor, height, nationality } =
    childInfo;

  const fullDynamicPrompt = `Create a story of 2 pages for a ${age} years old ${gender} named ${name}, with physical characteristics, like the ${gender}'s hair color is ${hairColor}, ${eyeColor} eye color, height of ${height}cm, and from a country of ${nationality.name}`;

  return fullDynamicPrompt;
};

export const getAutoImageGenPromptString = (childInfo: ChildInfo): string => {
  const { name, gender, age, hairColor, eyeColor, height, nationality } =
    childInfo;

  const fullDynamicPrompt = `A ${age} years old ${gender} named ${name}, with physical characteristics, like the ${gender}'s hair color is ${hairColor}, ${eyeColor} eye color, height of ${height}cm, and from a country of ${nationality.name}`;

  return fullDynamicPrompt;
};
