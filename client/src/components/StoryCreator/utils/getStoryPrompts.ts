import {
  AdultGenderEnum,
  ChildGenderEnum,
  ProfileInfo,
  Story,
  StoryCreatorInitialState,
} from "../store/state";

import { Keywords } from "src/shared/types/seo";

const getGenderDescription = (gender: ProfileInfo["gender"]): string => {
  if (gender === ChildGenderEnum.Boy) return "boy";
  if (gender === ChildGenderEnum.Girl) return "girl";
  if (gender === AdultGenderEnum.Male) return "male adult";
  return "female adult";
};

const getGenderPronounInstruction = (gender: ProfileInfo["gender"]): string =>
  gender === ChildGenderEnum.Boy || gender === AdultGenderEnum.Male
    ? "Use he/him pronouns and do not describe the protagonist as a girl."
    : "Use she/her pronouns and do not describe the protagonist as a boy.";

/**
 * Builds the AI prompt for the story. Dispatches on the chosen format:
 * "comic" → ~6 illustrated pages (caption + scene per page); otherwise the
 * original long-prose prompt (unchanged default).
 */
export const getCreateStoryPrompt = (
  promptParams: StoryCreatorInitialState
): string => {
  if (promptParams.format === "comic") {
    return getCreateComicPrompt(promptParams);
  }
  return getLongStoryPrompt(promptParams);
};

const getLongStoryPrompt = (
  promptParams: StoryCreatorInitialState
): string => {
  const { name, age, gender, interests, language } = promptParams.profileInfo;

  const { moral, tone, environment, minWords, maxWords } =
    promptParams.storyParams;

  // `Write a story that is ${audioLength} minutes long ${
  const fullDynamicPrompt = `Write a story ${
    language.value ? ` in the language of ${language.name},` : "English"
  } with the following outputs inside of the curly brackets for the data ETL process.
    Make sure the Title, Story summary, Story, and Poem are each between curly brackets for easy data extraction.
    The Story should be a LONG, immersive multi-scene bedtime story of approximately ${Math.round(
      (minWords + maxWords) / 2
    )} words (keep it between ${minWords} and ${maxWords} words), unfolding across several scenes with a clear beginning, a developed middle, and a satisfying ending. The Poem is separate and short (4-6 rhyming verses) and does NOT count toward that word target.

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

    {Provide a story summary here, not longer than 100 characters, outlining the basic plot and key elements of the story here.}

    {Provide the story here with several scenes or chapters. Refrain from mentioning the chapters.
    Just provide the text of the story as it is a bedtime story for kids, building the drama accordingly.}

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
     - Protagonist: ${name}, a ${age}-year-old ${getGenderDescription(
    gender
  )}. ${getGenderPronounInstruction(gender)}
     - Supporting Characters: ${
       interests.length
         ? `Create 2-3 friendly supporting characters connected to ${interests}, with simple, easy-to-pronounce names and brief descriptions.`
         : `Create 1-2 friendly supporting characters with simple, easy-to-pronounce names and brief descriptions.`
     } Introduce each character when they first appear, and keep the cast consistent — do not bring in new, unexplained characters late in the story.

    Ensure the story is compliant for children aged 1-12, with no explicit content outside this age range.`;

  return fullDynamicPrompt;
};

/**
 * Comic-book prompt. Produces an ordered, curly-bracket-delimited structure
 * the server `extractComicParts` parses: {title}{summary} then, for each of
 * the 6 pages, {caption}{scene}. The caption is shown in the reader; the scene
 * is stored as the page's image prompt for later illustration generation.
 */
export const getCreateComicPrompt = (
  promptParams: StoryCreatorInitialState
): string => {
  const { name, age, gender, interests, language } = promptParams.profileInfo;
  const { moral, tone, environment } = promptParams.storyParams;

  return `Write a 6-page children's bedtime COMIC story${
    language.value ? ` in the language of ${language.name}` : " in English"
  } for a ${age}-year-old ${getGenderDescription(gender)} named ${name}. ${getGenderPronounInstruction(
    gender
  )}

This must read as ONE continuous, logical story — not six unrelated pictures. Plan the whole story first, then write the pages so each one follows naturally from the one before it.

Story arc across the 6 pages:
- Page 1: Introduce ${name} in the setting AND introduce every friend or companion who appears later (give them simple, easy-to-pronounce names and show how ${name} already knows them). Establish the cozy bedtime mood.
- Pages 2-3: A gentle little problem, wish, or adventure begins and gradually builds.
- Pages 4-5: ${name} and the friends work through it together — the heart of the story.
- Page 6: A warm, calming, happy ending that settles down toward sleep.

Continuity rules (VERY IMPORTANT — this is what makes the story make sense):
- Introduce every character on the page they first appear. NEVER mention a friend (such as an animal companion) for the first time as if the reader already knows them.
- Each page's caption must continue directly from the previous page: same characters, same place unless the story clearly moves them, and no sudden jumps in time or topic.
- Keep one consistent cast. The friends introduced on page 1 are the same ones throughout; do not invent brand-new unexplained characters partway through.
- Each page's illustration prompt must depict EXACTLY what that same page's caption describes (same characters, same action, same place) so the picture and the words always match.

Output ONLY curly-bracket sections for an automated ETL process, in this EXACT order with NOTHING between them:
{The comic title}
{A one-sentence summary, no longer than 100 characters}

Then, for EACH of the 6 pages in order, output two sections:
{The page story caption: 2 to 4 short sentences of warm comic-book narration that continue the ongoing story, including one short line of character dialogue when it fits naturally. This is the actual story text shown to the reader under the image.}
{The page illustration prompt: one vivid paragraph describing ONE single comic scene that matches this page's caption. Describe each character and their appearance, the action, setting, emotion, and camera angle. Do not include the actual caption text in this section. Do not describe multiple panels or a collage.}

That is 14 curly-bracket sections total: title, summary, then 6 pairs of story caption and scene prompt. Do not number the pages or add any other text.

Comic art direction for all 6 pages:
- Make ${name} the consistent main hero in every scene.
- Introduce 1-2 friendly supporting characters on page 1 and keep them throughout the story.
- Each page must be a separate full-page comic scene, not a grid and not multiple panels.
- Keep captions simple and soothing for children aged 1-12, while making the overall story feel complete and logical, with a clear beginning, middle, and end.
- Use expressive child-friendly characters, clear emotions, cozy bedtime energy, and a strong visual action in every scene.
${tone.value ? `- Tone: ${tone.name}.` : ""}
${moral.value ? `- Value to teach: ${moral.name}.` : ""}
${environment.value ? `- Setting: a/an ${environment.name}.` : ""}
${interests.length ? `- Weave in the child's interests: ${interests}.` : ""}
Ensure all content is fully appropriate for young children.`;
};

export const getCreateImagePrompt = (childInfo: ProfileInfo): string => {
  const { name, gender, age } = childInfo;

  const fullDynamicPrompt = `A ${age} years old ${gender.toLowerCase()} named ${name}, with physical characteristics`;

  return fullDynamicPrompt;
};

export const getStorySeoPrompt = (story: Story): string => {
  const { summary, profileInfo } = story;
  const appLink = "www.talepod.com";
  const keywordsByLang = Keywords[profileInfo.language.value] || [];

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
  Do not include the keywords into the internal links, internal links refer ONLY to this site (${appLink}).
  Any hyperlink should open in a new tab.

  In the response, don't mention anything other than the required SEO-optimized text and include it around curly brackets for easy data extraction.`;

  return fullDynamicPrompt;
};
