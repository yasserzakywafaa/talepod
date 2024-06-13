import { ChildInfo, StoryCreatorInitialState } from "../store/state";

export const getAutoTextGenPromptString = (
  promptParams: StoryCreatorInitialState
): string => {
  const { name, gender, age, interests, language } = promptParams.childInfo;

  const { moral, tone, audioLength, environment } = promptParams.storyParams;

  const customParams = {
    childInfo: {
      name: "",
      gender,
      age: "",
      interests: "",
      language: "",
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
    customParams.generatedStory.tone = `The tone of the story to be ${tone.name}.`;

  if (moral)
    customParams.generatedStory.moral = `Value or theme: The value the parent wants to teach their kid through the story is ${moral.name}, `;

  if (environment)
    customParams.generatedStory.environment = `Environment: the environment of the story to be at the ${environment.name}, `;

  if (language)
    customParams.childInfo.language = ` in the language of ${language.name},`;

  if (interests)
    customParams.childInfo.interests = `Supporting characters to be around ${interests}`;

  const fullDynamicPrompt = `Write a story that is ${audioLength} minutes long ${
    customParams.childInfo.language
  } with the following outputs inside of the curly brackets to be ready for data ETL process.
    Make sure the Title, Story summary, Story, Poem are each between curly brackets so the development team can split the data to those fields respectively.

    {provide Story title}

    {provide here Story summary that is not longer than 120 characters Outlining the basic plot and key elements of the story.}

    {provide the story with 4-5 scenes or chapters. Do not mention the chapters. Just provide the text of the story as it is a bedtime story for kids hence build the drama accordingly and ensure a length of ${audioLength} minutes as mentioned above}

    {provide the poem: Create a bedtime poem that summarizes the story in 4-6 rhyming verses}

    ${customParams.generatedStory.tone}
    ${customParams.generatedStory.moral}
    ${customParams.generatedStory.environment}
    The characters of the story are: The protagonist/main character is ${name}, a ${age}-year-old ${gender.toLowerCase()}.
    ${customParams.childInfo.interests}
    
    Please ensure that the story is kids compliant. All kids between 1 year to 12 years, so no explicit content outside this age range.
    `;

  return fullDynamicPrompt;
};

export const getAutoImageGenPromptString = (childInfo: ChildInfo): string => {
  const { name, gender, age } = childInfo;

  const fullDynamicPrompt = `A ${age} years old ${gender} named ${name}, with physical characteristics`;

  return fullDynamicPrompt;
};
