import { ProfileInfo, Story, StoryCreatorInitialState } from "../store/state";

import { Keywords } from "src/shared/seo";

export const getCreateStoryPrompt = (
  promptParams: StoryCreatorInitialState
): string => {
  const { name, gender, age, interests, language } = promptParams.profileInfo;

  const { moral, tone, audioLength, environment } = promptParams.storyParams;

  const fullDynamicPrompt = `Write a story that is ${audioLength} minutes long ${
    language.value ? ` in the language of ${language.name},` : "English"
  } with the following outputs inside of the curly brackets to be ready for the data ETL process.
    Make sure the Title, Story summary, Story, and Poem are each between curly brackets so the development team can split the data into those fields respectively.

    {Provide here the story title}

    {Provide here the story summary that is not longer than 120 characters Outlining the basic plot and key elements of the story.}

    {Provide here the story with 4-5 scenes or chapters. Refrain from mentioning the chapters. 
    Just provide the text of the story as it is a bedtime story for kids hence build the drama accordingly and ensure a length of ${audioLength} minutes as mentioned above.}

    {Provide here the story poem: Create a bedtime poem that summarizes the story in 4-6 rhyming verses}

    ${tone.value ? `The tone of the story to be ${tone.name}.` : ""}

    ${
      moral.value
        ? `Value or theme: The value the parent wants to teach their kid through the story is ${moral.name}.`
        : ""
    }

    ${
      environment.value
        ? `Environment: the environment of the story is at the ${environment.name}.`
        : ""
    }
  
    The characters of the story are: The protagonist/main character is ${name}, a ${age}-year-old ${gender.toLowerCase()}.
    
    ${interests.length ? `Supporting characters to be around ${interests}` : ""}
    
    Please ensure that the story is kids compliant. All kids between 1 year and 12 years old, so no explicit content outside this age range.`;

  return fullDynamicPrompt;
};

export const getCreateImagePrompt = (childInfo: ProfileInfo): string => {
  const { name, gender, age } = childInfo;

  const fullDynamicPrompt = `A ${age} years old ${gender} named ${name}, with physical characteristics`;

  return fullDynamicPrompt;
};

export const getStorySeoPrompt = (story: Story): string => {
  const { summary, profileInfo } = story;
  const appLink = "www.talepod.com";
  const keywordsByLang = Keywords[profileInfo.language.value];
  const keywords = keywordsByLang.flatMap((word) => word.keyword);
  const keywordsVolume = keywordsByLang.flatMap((word) => word.keywordVolume);
  const keywordsDifficulty = keywordsByLang.flatMap(
    (word) => word.keywordDifficulty
  );

  const fullDynamicPrompt = `Write a seo optimized text that attracts organic traffic to ${appLink} to place after a bedtime story, 
  with the following story parameters and position the text inside the appropriate HTML tags to use: Story summary: ${summary}. 
  The text should include at least one <h2> ta, and create it in the language of ${
    profileInfo.language.name
  }.
  ${
    keywordsByLang
      ? `Also include the following keywords and their respective volume and keyword difficulty: ${keywords}; ${keywordsVolume}; ${keywordsDifficulty}`
      : ""
  }
  In the response, don't mention anything other than the required seo optimized text and include it around curly braces "{ }" so that it can be easily extracted by the development team.`;

  return fullDynamicPrompt;
};
