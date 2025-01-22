import { SupportedLanguages } from "src/utils/languages";

export const getCreateBlogPrompt = (
  storyTitle: string,
  language: SupportedLanguages,
  linkedBlog?: {
    title: string;
    url: string;
  }
) => {
  const fullDynamicPrompt = `Create a blog post in ${language} about the popular story '${storyTitle}' for parents seeking bedtime stories for kids. Follow this structure:

**Structure**
- Divide the blog into exactly five sections, each enclosed in curly braces:
    1. {Title}
    2. {Introduction}
    3. {MainBlog}
    4. {Conclusion}
    5. {CallToAction}

Title:
Include '${storyTitle}' as the primary keyword. Make it catchy and SEO-friendly (e.g., 'How ${storyTitle} Can Become Your Child's Favorite Bedtime Story | Talepod').

Meta Description:
Write a 150-160 character meta description including '${storyTitle}' and phrases like 'bedtime stories for kids' or 'children's stories in ${language}.'

Introduction:

Start with a relatable hook (e.g., 'Looking for a magical story to spark your child's imagination?').
Mention the story's cultural/popularity highlights in ${language}.
Include secondary keywords like '${language} bedtime stories' or 'kids' stories.'
Main Blog (H2 Headers):

The Magic of ${storyTitle} (H2)
Briefly summarize the story (2-3 paragraphs).
Highlight its moral/educational value.
${
  linkedBlog
    ? `Add a natural internal link to another blog ${linkedBlog.url} (e.g., 'If your child loves ${storyTitle}, they'll adore our ${linkedBlog.title} story.').`
    : ""
}
Why ${storyTitle} Works for Bedtime (H2)
Discuss pacing, imagery, and calming themes.
Include a tip for parents (e.g., voices for characters).
${
  linkedBlog
    ? `Link to a related blog ${linkedBlog.url} (e.g., 'Discover more relaxing tales in our ${linkedBlog.title} guide.'). Use anchor text like 'Explore our ${linkedBlog.title} story'`
    : ""
}

Conclusion (H2):

Reiterate the story's benefits (e.g., creativity, life lessons).
Add a final internal link (e.g., 'Explore our collection of ${language} bedtime stories here.').
Call to Action (CTA):

Encourage readers to try your app (e.g., 'Ready to make bedtime magical? Use Talepod to generate personalized versions of ${storyTitle} and more!').
Use urgency (e.g., 'Start your free trial tonight!').
SEO Checklist:

Primary keyword in title, introduction, 2x in body.
Secondary keywords (e.g., 'kids' bedtime stories') 2-3x.
Ensure readability (short paragraphs, bullet points if needed).
Generate this in ${language} with a warm, engaging tone for parents. Avoid AI jargon.

**Output Format**
   - **Enclose each section in curly braces** exactly:  
     {Provide the blog Title here}
     {Provide the blog  Introduction here}
     {Provide the blog MainBlog here}
     {Provide the blog  Conclusion here}
     {Provide the blog  CallToAction here}
   - Do not introduce extra brackets or reorder the sections.`;

  return fullDynamicPrompt;
};
