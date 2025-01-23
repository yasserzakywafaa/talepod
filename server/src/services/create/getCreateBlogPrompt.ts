import CONFIG from "../../config";
import { SupportedLanguages } from "src/utils/languages";

export const getCreateBlogPrompt = (
  storyTitle: string,
  language: SupportedLanguages,
  linkedBlog?: {
    title: string;
    url: string;
  }
) => {
  const appName = "Talepod";
  const createStoryLink = CONFIG.IS_DEV
    ? "dev.talepod.com/create"
    : "www.talepod.com/create";
  const fullDynamicPrompt = `
Create a blog post in ${language} about '${storyTitle}' for parents seeking bedtime stories for kids with the following outputs inside of the curly brackets for the data ETL process.
Make sure the Title, Introduction, MainBlog, Conclusion and CallToAction are each between curly brackets for easy data extraction.
Follow this structure:

**Structure**
- Divide the blog into exactly five sections, each enclosed in curly braces:
    1. {Title}
    2. {Introduction}
    3. {MainBlog}
    4. {Conclusion}
    5. {CallToAction}


Consider the following parameters while creating the story:
  • Use appropriate punctuation (commas, periods, question marks) to guide natural pauses and intonation.
  •	Break longer sentences into shorter, more manageable chunks.
  •	Use contractions to mimic natural speech patterns (e.g., “I'm” instead of “I am”).
  •	Emphasize important words by capitalizing them or using asterisks (e.g., “This is IMPORTANT).
  •	If supported by Openai TTS service, use custom pronunciation dictionaries for correct pronunciation of names and specialized terms.
  •	Make the blog sound engaging and natural.
  •	Use '${storyTitle}' 2x in the body.
  •	Use '${language} bedtime stories' 3x.
  •	Short paragraphs, friendly tone.


{Provide the story title here. Make sure it is catchy and SEO-friendly title with '${storyTitle}'.}

{Provide a story introduction here. Start with a hook. Mention the story's cultural/popularity highlights in ${language}. Use keywords: '${language} bedtime stories', 'kids' stories'.}

{Provide the Main Blog here. Summarize the story (2-3 paragraphs). Highlight its moral/educational value.
${
  linkedBlog
    ? `Add a natural internal link to another blog ${linkedBlog.url} (e.g., 'If your child loves ${storyTitle}, they'll adore our ${linkedBlog.title} story.').`
    : ""
}
Discuss pacing, imagery, and calming themes.
Include a parent tip (e.g., character voices).
Include multiple headers (H2).
${
  linkedBlog
    ? `Link to a related blog ${linkedBlog.url} (e.g., 'Discover more relaxing tales in our ${linkedBlog.title} guide.'). Use anchor text like 'Explore our ${linkedBlog.title} story'`
    : ""
}
}

{Provide a bedtime conclusion here. Reiterate benefits and link to your ${language} story collection.
Add a final internal link (e.g., 'Explore our collection of ${language} bedtime stories here.')}



{Provide a bedtime call-to-action here. Encourage using ${appName} (e.g., "Ready to make bedtime magical? Try ${createStoryLink} to generate personalized versions of ${storyTitle} and more!").
- Add urgency: "Start your free trial tonight!}`;

  return fullDynamicPrompt;
};
