import { ChildInfo, StoryCreatorInitialState } from "../store/state";

export const getAutoTextGenPromptString = (
  promptParams: StoryCreatorInitialState
): string => {
  const { name, gender, age, interests, nationality } = promptParams.childInfo;

  const { moral, tone, audioLength, environment, maxCharacters } =
    promptParams.generatedStory;

  const customParams = {
    childInfo: {
      name: "",
      gender,
      age: "",
      interests: "",
      nationality: "",
    },
    generatedStory: {
      moral: "",
      tone: "",
      audioLength: "",
      environment: "",
      maxCharacters: "",
    },
  };

  if (tone)
    customParams.generatedStory.tone = `The tone of the story to be ${tone.name}, `;

  if (moral)
    customParams.generatedStory.moral = `Value or theme: The value the parent wants to teach their kid through the story is ${moral.name}, `;

  if (environment)
    customParams.generatedStory.environment = `the environment of the story to be at ${environment.name}, `;

  if (nationality)
    customParams.childInfo.nationality = ` from the country of ${nationality.name}.`;

  if (interests)
    customParams.childInfo.interests = `Supporting characters to be around ${interests}`;

  // const fullDynamicPrompt = `Create a story for 1 page children's book that has around 200 characters per page, for a ${age} years old ${gender} named ${name}, with physical characteristics, like the ${gender}'s hair color is ${hairColor}, ${eyeColor} eye color, height of ${height}cm, and from a country of ${nationality.name}`;
  // const fullDynamicPrompt = `Create a story that has around 200 characters, for a ${customParams.age} ${gender} named ${name}, with physical characteristics like ${customParams.hairColor}${customParams.eyeColor}and${customParams.nationality}`;

  const fullDynamicPrompt = `Write a story that is ${audioLength} minutes long with the following structure:
    Title: Provide a title for the story.
    Summary: Provide a summary for the story that is not longer than ${maxCharacters} characters Outlining the basic plot and key elements of the story.
    Structure: Structure the story in 4-5 chapters that are ${audioLength} minutes long if read by the parent
    Poem: Create a bedtime poem that summarizes the story in 4-6 rhyming verses
    ${customParams.generatedStory.tone}
    ${customParams.generatedStory.moral}
    ${customParams.generatedStory.environment}
    The characters of the story are: The protagonist / main character is a ${age}-year-old ${gender.toLowerCase()} called ${name}.
    ${customParams.childInfo.interests}`;

  return fullDynamicPrompt;
};

export const getAutoImageGenPromptString = (childInfo: ChildInfo): string => {
  const { name, gender, age, nationality } = childInfo;

  const fullDynamicPrompt = `A ${age} years old ${gender} named ${name}, with physical characteristics, and from a country of ${nationality?.name}`;

  // const longPrmpt = `Create images children's book that will be converted to pdf to go be printed as small square 196mmx196mm children book.

  return fullDynamicPrompt;
};
