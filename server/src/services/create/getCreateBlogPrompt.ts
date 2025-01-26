import CONFIG from "../../config";
import { SupportedLanguages } from "src/utils/languages";

export const getCreateBlogPrompt = (
  dataTitle: string,
  language: SupportedLanguages,
  linkedBlog?: {
    title: string;
    url: string;
  }
) => {
  const appName = "Talepod";
  const exploreUrl = `${CONFIG.APP_URL}/bedtime-stories`;
  const createBlogUrl = `${CONFIG.APP_URL}/create`;
  const fullDynamicPrompt = `
Create a blog post in ${language} about '${dataTitle}' for parents seeking bedtime stories for kids with the following outputs inside of the curly brackets for the data ETL process.
Make sure the Title, Introduction, MainBlog, Conclusion and CallToAction are each between curly brackets for easy data extraction.
Follow this structure:

**Structure**
- Divide the blog into exactly five sections, each enclosed in curly braces:
    1. {Title}
    2. {Introduction}
    3. {MainBlog}
    4. {Conclusion}
    5. {CallToAction}


Consider the following parameters while creating the blog:
  • Use appropriate punctuation (commas, periods, question marks) to guide natural pauses and intonation.
  •	Break longer sentences into shorter, more manageable chunks.
  •	Use contractions to mimic natural speech patterns (e.g., “I'm” instead of “I am”).
  •	Emphasize important words by capitalizing them or using asterisks (e.g., “This is IMPORTANT).
  •	If supported by Openai TTS service, use custom pronunciation dictionaries for correct pronunciation of names and specialized terms.
  •	Make the blog sound engaging and natural.
  •	Use '${dataTitle}' 2x in the body.
  •	Use '${language} bedtime stories' 3x.
  •	Short paragraphs, friendly tone.


{Provide the blog title here. Make sure it is catchy and SEO-friendly title with '${dataTitle}'. Just output the title, remove any redundant characters.}

{Provide the blog introduction here. Start with a hook. Mention the cultural/popularity highlights in ${language}. Use keywords: 'kids' stories'.}

{Provide the Main Blog here. Summarize the blog (2-3 paragraphs). Highlight its moral/educational value.
${
  linkedBlog
    ? `Add a natural internal link to another related blog ${linkedBlog.url} (e.g., 'If your child loves ${dataTitle}, they'll adore ${linkedBlog.title}.'). Use anchor text.`
    : ""
}
Discuss pacing, imagery, and calming themes.
Include a parent tip (e.g., character voices).
Include multiple headers (H2).
}

{Provide the blog conclusion here. Reiterate benefits and add a final internal link to your ${exploreUrl} collection. Use anchor text.}

{Provide the blog call-to-action here. 
Encourage using ${appName} with urgency (e.g., "Ready to make bedtime magical? Try ${createBlogUrl} to generate personalized versions of ${dataTitle} and more!"). Use anchor text.
}`;

  return fullDynamicPrompt;
};
