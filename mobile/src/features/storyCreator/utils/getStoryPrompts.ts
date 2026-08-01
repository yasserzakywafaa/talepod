/**
 * Duplicates `server/src/services/create/storyPrompt.ts` on purpose: older
 * servers read `storyPrompt` off the body and fail without it.
 * 
 * DELETE only once every environment builds its own — mobile ships over the
 * air and must never assume a server capability is deployed.
 */

import {
  AdultGenderEnum,
  ChildGenderEnum,
  ProfileInfo,
  StoryCreatorInitialState,
} from "../store/state";


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

/** Age-aware reading rules shared by comic captions and long-story prose. */
const getYoungReaderRules = (
  age: number,
): { comicCaptionRule: string; longStoryVocabRule: string } => {
  let comicCaptionRule: string;
  if (age <= 4) {
    comicCaptionRule = "1 sentence only, maximum 12 words total";
  } else if (age <= 7) {
    comicCaptionRule = "1 to 2 sentences, maximum 18 words total";
  } else {
    comicCaptionRule = "1 to 2 sentences, maximum 25 words total";
  }

  const longStoryVocabRule = `Use vocabulary at or below a ${age}-year-old's reading level. Keep most sentences under 10 words. Use only common, everyday words a ${age}-year-old knows. Avoid rare or literary words (for example: shivered, kingdom, whispered, nestled, magnificent). Prefer concrete nouns and simple active verbs.`;

  return { comicCaptionRule, longStoryVocabRule };
};

// Comic → ~6 illustrated pages (caption + scene each); anything else gets
// the long-prose prompt.
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

  const { longStoryVocabRule } = getYoungReaderRules(age);
  const targetWords = Math.round((minWords + maxWords) / 2);
  const ageWordHint =
    age <= 5
      ? `Aim for the lower end of the range (around ${minWords} words).`
      : "";

  const fullDynamicPrompt = `Write a story ${
    language.value ? ` in the language of ${language.name},` : "English"
  } with the following outputs inside of the curly brackets for the data ETL process.
    Make sure the Title, Story summary, Story, and Poem are each between curly brackets for easy data extraction.
    The Story should be a cozy bedtime story of approximately ${targetWords} words (keep it between ${minWords} and ${maxWords} words). ${ageWordHint}
    Unfold across 3 to 4 short scenes with a clear beginning, a small gentle problem, and a warm, calming ending. The Poem is separate and short (3-4 rhyming verses) and does NOT count toward that word target.

    Reading level and vocabulary:
      • ${longStoryVocabRule}
      • Write in short paragraphs of 2 to 3 sentences each.
      • Use direct, spoken-aloud language — as if reading to a child at bedtime.

    Interactive moments (VERY IMPORTANT — weave 4 to 6 into the story prose):
      • Address the child or parent directly with short, playful lines mixed into the narrative.
      • Mix gentle questions ("What color do you think the turtle's shell is?"), sounds to make ("Can you make a soft whoosh sound like the waves?"), and simple actions ("Stretch your arms wide, just like ${name}.").
      • Keep each interactive line to one short sentence.
      • Place them naturally between story beats — do not cluster them all at the end.

    TTS-friendly delivery:
      • Use appropriate punctuation to guide natural pauses.
      • Use contractions for natural speech (e.g., "I'm" instead of "I am").
      • Make the story sound warm, engaging, and easy to follow aloud.

    {Provide the story title here}

    {Provide a story summary here, not longer than 100 characters, outlining the basic plot and key elements of the story here.}

    {Provide the story here as 3 to 4 short scenes. Do not label scenes or chapters — just flowing bedtime prose with the interactive moments woven in.}

    {Provide a bedtime poem here that summarizes the story in 3-4 rhyming verses}

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

// Curly-bracket structure the server's `extractComicParts` parses:
// {title}{summary}, then {caption}{scene} per page.
export const getCreateComicPrompt = (
  promptParams: StoryCreatorInitialState
): string => {
  const { name, age, gender, interests, language } = promptParams.profileInfo;
  const { moral, tone, environment } = promptParams.storyParams;
  const { comicCaptionRule, longStoryVocabRule } = getYoungReaderRules(age);

  return `Write a 6-page children's bedtime COMIC story${
    language.value ? ` in the language of ${language.name}` : " in English"
  } for a ${age}-year-old ${getGenderDescription(gender)} named ${name}. ${getGenderPronounInstruction(
    gender
  )}

This must read as ONE continuous, logical story — not six unrelated pictures. Plan the whole story first, then write the pages so each one follows naturally from the one before it.

Story arc across the 6 pages:
- Page 1: Introduce ${name} in the setting AND name every friend who appears later (simple, easy-to-pronounce names only — e.g. "Milo the seahorse"). Do not describe how they look in the caption; save appearance details for the illustration prompt. Establish the cozy bedtime mood.
- Pages 2-3: A gentle little problem, wish, or adventure begins and gradually builds.
- Pages 4-5: ${name} and the friends work through it together — the heart of the story.
- Page 6: A warm, calming, happy ending that settles down toward sleep.

Continuity rules (VERY IMPORTANT — this is what makes the story make sense):
- Introduce every character on the page they first appear. NEVER mention a friend (such as an animal companion) for the first time as if the reader already knows them.
- Each page's caption must continue directly from the previous page: same characters, same place unless the story clearly moves them, and no sudden jumps in time or topic.
- Keep one consistent cast. The friends introduced on page 1 are the same ones throughout; do not invent brand-new unexplained characters partway through.
- Each page's illustration prompt must depict EXACTLY what that same page's caption describes (same characters, same action, same place) so the picture and the words always match.

Caption rules (VERY IMPORTANT — captions are read aloud to young children):
- Length: ${comicCaptionRule}.
- Style: direct, spoken-aloud language (e.g. "Emily is in bed. Milo and Luna are here." — NOT flowery prose).
- ${longStoryVocabRule}
- Each caption carries ONE story beat only. Do not pack multiple ideas into one caption.
- Put character appearance, setting detail, mood, and fancy place names in the illustration prompt — NOT in the caption. Use simple words in captions (e.g. "garden" not "Sea-Lullaby Garden").
- Optional dialogue: at most one short line, maximum 5 words.

Output ONLY curly-bracket sections for an automated ETL process, in this EXACT order with NOTHING between them:
{The comic title}
{A one-sentence summary, no longer than 100 characters}

Then, for EACH of the 6 pages in order, output two sections:
{The page story caption: follow the caption rules above. This is the only story text shown to the reader under the image.}
{The page illustration prompt: one vivid paragraph describing ONE single comic scene that matches this page's caption. Describe each character and their appearance, the action, setting, emotion, and camera angle. Do not include the actual caption text in this section. Do not describe multiple panels or a collage.}

That is 14 curly-bracket sections total: title, summary, then 6 pairs of story caption and scene prompt. Do not number the pages or add any other text.

Comic art direction for all 6 pages:
- Make ${name} the consistent main hero in every scene.
- Introduce 1-2 friendly supporting characters on page 1 and keep them throughout the story.
- Each page must be a separate full-page comic scene, not a grid and not multiple panels.
- Captions must stay short and simple while the overall story feels complete and logical, with a clear beginning, middle, and end.
- Use expressive child-friendly characters, clear emotions, cozy bedtime energy, and a strong visual action in every scene.
${tone.value ? `- Tone: ${tone.name}.` : ""}
${moral.value ? `- Value to teach: ${moral.name}.` : ""}
${environment.value ? `- Setting: a/an ${environment.name}.` : ""}
${interests.length ? `- Weave in the child's interests: ${interests}.` : ""}
Ensure all content is fully appropriate for young children.`;
};
