import {
  ChildGenderEnum,
  ProfileInfo,
  Story,
  StoryCreatorInitialState,
} from "../store/state";

import { Keywords } from "src/shared/seo";

export const getCreateStoryPrompt = (
  promptParams: StoryCreatorInitialState
): string => {
  const { name, gender, age, interests, language } = promptParams.profileInfo;

  const { moral, tone, environment, maxCharacters } = promptParams.storyParams;

  const genderWord =
    gender === ChildGenderEnum.Boy || gender === ChildGenderEnum.Girl
      ? "child"
      : gender.toLowerCase();

  // `Write a story that is ${audioLength} minutes long ${
  const fullDynamicPrompt = `Write a story ${
    language.value ? ` in the language of ${language.name},` : "English"
  } with the following outputs inside of the curly brackets for the data ETL process.
    Make sure the Title, Story summary, Story, and Poem are each between curly brackets for easy data extraction.

    Consider the following parameters while creating the story:
      • Use appropriate punctuation (commas, periods, question marks) to guide natural pauses and intonation.
      •	Break longer sentences into shorter, more manageable chunks.
      •	Use contractions to mimic natural speech patterns (e.g., “I'm” instead of “I am”).
      •	Use phonetic spelling for words that might be mispronounced by the TTS engine.
      •	Emphasize important words by capitalizing them or using asterisks (e.g., “This is IMPORTANT).
      •	If supported by Openai TTS service, use custom pronunciation dictionaries for correct pronunciation of names and specialized terms.
      •	Make the story sound engaging and natural.
      •	Ensure the language is simple, soothing, and appropriate for children aged 1-12.

    {Provide the story title here}

    {Provide a story summary here, not longer than 120 characters, outlining the basic plot and key elements of the story here.}

    {Provide the story here with 4-5 scenes or chapters. Refrain from mentioning the chapters. 
    Just provide the text of the story as it is a bedtime story for kids, building the drama accordingly. Ensure the story is about ${maxCharacters} characters in length.}

    {Provide a bedtime poem here that summarizes the story in 4-6 rhyming verses}

    ${tone.value ? `The tone of the story is to be ${tone.name}.` : ""}

    ${
      moral.value
        ? `Value or theme: The value to teach through the story is ${moral.name}.`
        : ""
    }

    ${
      environment.value
        ? `Environment: The environment of the story is a/an ${environment.name}.`
        : ""
    }

    Characters:
     - Protagonist: ${name}, a ${age}-year-old ${genderWord}.
     - Supporting Characters: ${
       interests.length
         ? `Friends around ${interests} (please create 2-3 friends with simple, easy-to-pronounce names and brief descriptions)`
         : ""
     }
    
    Ensure the story is compliant for children aged 1-12, with no explicit content outside this age range.`;

  return fullDynamicPrompt;
};

export const getCreateImagePrompt = (childInfo: ProfileInfo): string => {
  const { name, gender, age } = childInfo;

  const fullDynamicPrompt = `A ${age} years old ${gender.toLowerCase()} named ${name}, with physical characteristics`;

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

  const fullDynamicPrompt = `Write an SEO-optimized text that attracts organic traffic to ${appLink} to place after a bedtime story, 
  with the following story parameters and position the text inside the appropriate HTML tags to use: 
  
  Story summary: ${summary}. 

  The text should include at least one <h2> tag, and create it in the language of ${
    profileInfo.language.name
  }.
  ${
    keywordsByLang.length
      ? `Also include the following keywords and their respective volume and keyword difficulty: 
      
      • Keywords: ${keywords}
      • Volume: ${keywordsVolume}
      • Keyword Difficulty: ${keywordsDifficulty}
      `
      : ""
  }

  Ensure the keywords are naturally integrated into the text. 
  Include internal links only to this site (${appLink}) and a call to action. 
  Any hyperlink should open in a new tab. 

  In the response, don't mention anything other than the required SEO-optimized text and include it around curly brackets for easy data extraction.`;

  console.log("SEO Text:>>>", {
    fullDynamicPrompt,
  });

  return fullDynamicPrompt;
};
